import { assertUnreachable } from "shared/utils/assertUnreachable";
import {
  canResetConfiguration,
  canResetMailingList,
  canScheduleExport,
  canScheduleGenerate,
  canScheduleParse,
} from "shared/mailing-list/mailing-list.utils";
import { getSimpleJob, scheduleJob } from "job-processor";
import type { IJobsSimple } from "job-processor";
import type { ObjectId } from "mongodb";
import { zObjectIdMini } from "zod-mongodb-schema";
import { z } from "zod/v4-mini";
import type { IMailingListV2 } from "shared/models/mailingListV2.model";
import { conflict, internal, notFound } from "@hapi/boom";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { parseMailingList } from "./parsing/mailing-list-parser";
import { generateMailingList, validateMailingListConfiguration } from "./generator/mailing-list-generator";
import { exportMailingList } from "./exporter/mailing-list-exporter";

const zJobPayload = z.object({
  id: zObjectIdMini,
});

export async function processMailingList(job: IJobsSimple, signal: AbortSignal) {
  const payload = zJobPayload.parse(job.payload);
  const mailingList = await getDbCollection("mailingListsV2").findOne({
    _id: payload.id,
  });

  if (!mailingList) {
    throw notFound("Liste de diffusion introuvable", { id: payload.id });
  }

  try {
    if (!job._id.equals(mailingList.job_id)) {
      throw internal(`L'ID du travail de la liste de diffusion ne correspond pas`, {
        mailingList,
        job,
      });
    }

    if (mailingList.status === "parse:scheduled") {
      await parseMailingList(mailingList, job, signal);
      return;
    }

    if (mailingList.status === "generate:scheduled") {
      await generateMailingList(mailingList, job, signal);
      await scheduleMailingListJob(mailingList._id, "export:scheduled");
      return;
    }

    if (mailingList.status === "export:scheduled") {
      await exportMailingList(mailingList, job, signal);
      return;
    }

    throw internal("La liste de diffusion n'est pas planifiée pour l'analyse ou la génération", { mailingList });
  } catch (error) {
    await onMailingListJobFailed(mailingList, error.message);
    throw error;
  }
}

export async function onMailingListJobExited(job: IJobsSimple) {
  const payload = zJobPayload.parse(job.payload);
  const mailingList = await getDbCollection("mailingListsV2").findOne({
    _id: payload.id,
  });

  if (!mailingList || !job._id.equals(mailingList.job_id)) {
    return;
  }

  if (job.status === "errored") {
    await onMailingListJobFailed(
      mailingList,
      job.output?.error ?? "Une erreur est survenue lors du traitement de la liste de diffusion"
    );
  }
}

function getFailingStatus(mailingList: IMailingListV2): IMailingListV2["status"] {
  switch (mailingList.status) {
    case "parse:scheduled":
    case "parse:in_progress":
    case "parse:failure":
      return "parse:failure";

    case "generate:scheduled":
    case "generate:in_progress":
    case "generate:failure":
      return "generate:failure";

    // If generate:success fails, it means auto schedule to export:scheduled failed
    // We need to try to export again
    case "generate:success":
    case "export:scheduled":
    case "export:in_progress":
    case "export:failure":
      return "export:failure";

    case "initial":
    case "export:success":
    case "parse:success":
      return mailingList.status;
    default:
      assertUnreachable(mailingList.status);
  }
}

async function onMailingListJobFailed(mailingList: IMailingListV2, error: string) {
  const refreshed = await getDbCollection("mailingListsV2").findOne({ _id: mailingList._id });
  if (!refreshed) {
    throw notFound();
  }
  const failingStatus = getFailingStatus(refreshed);
  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        status: failingStatus,
        error,
        job_id: null,
        updated_at: new Date(),
      },
    }
  );
}

type ScheduledStatus = "parse:scheduled" | "generate:scheduled" | "export:scheduled";

function canTransitionToStatus(mailingList: IMailingListV2, expectedStatus: ScheduledStatus): boolean {
  switch (expectedStatus) {
    case "parse:scheduled":
      return canScheduleParse(mailingList);
    case "generate:scheduled":
      return canScheduleGenerate(mailingList);
    case "export:scheduled":
      return canScheduleExport(mailingList);
    default:
      assertUnreachable(expectedStatus);
  }
}

export async function scheduleMailingListJob(id: ObjectId, status: ScheduledStatus): Promise<boolean> {
  const mailingList = await getDbCollection("mailingListsV2").findOne({
    _id: id,
    job_id: null,
  });

  if (!mailingList) {
    throw conflict("La liste de diffusion est déjà en cours de traitement");
  }

  if (!canTransitionToStatus(mailingList, status)) {
    throw conflict(`La liste de diffusion ne peut pas passer au statut ${status}`);
  }

  const job = await scheduleJob({
    name: "mailing-list:process",
    payload: {
      id,
    },
  });

  await getDbCollection("mailingListsV2").updateOne(
    { _id: id },
    { $set: { job_id: job._id, status, updated_at: new Date() } }
  );

  return true;
}

function isJobDone(job: IJobsSimple): boolean {
  switch (job.status) {
    case "pending":
    case "running":
    case "paused":
      return false;
    case "errored":
    case "finished":
      return true;
    default:
      assertUnreachable(job.status);
  }
}

export async function recoverMailingListJobs(signal: AbortSignal) {
  const cursor = getDbCollection("mailingListsV2").find({ job_id: { $ne: null } }, { signal });

  for await (const mailingList of cursor) {
    if (signal.aborted) {
      break;
    }

    if (mailingList.job_id) {
      try {
        const job = await getSimpleJob(mailingList.job_id);
        if (job === null || isJobDone(job)) {
          // Even if the job finished without error, we consider it failed because the mailing list job_id was not reset
          await onMailingListJobFailed(mailingList, "Le traitement a échoué de manière inattendue");
        }
      } catch (error) {
        console.error("Error scheduling mailing list job:", error);
      }
    }
  }
}

export async function resetMailingList(id: ObjectId, status: "initial" | "parse:success") {
  const mailingList = await getDbCollection("mailingListsV2").findOne({
    _id: id,
  });

  if (!mailingList) {
    throw notFound("La liste de diffusion n'existe pas");
  }

  switch (status) {
    case "initial": {
      if (!canResetMailingList(mailingList)) {
        throw conflict("La liste de diffusion ne peut pas être réinitialisée");
      }

      break;
    }
    case "parse:success": {
      if (!canResetConfiguration(mailingList)) {
        throw conflict("La configuration de la liste ne peut pas être réinitialisée");
      }

      break;
    }
    default:
      assertUnreachable(status);
  }

  await getDbCollection("mailingListsV2").updateOne(
    { _id: id },
    { $set: { status: status, error: null, updated_at: new Date() } }
  );
}

export async function scheduleGenerate(id: ObjectId) {
  const mailingList = await getDbCollection("mailingListsV2").findOne({
    _id: id,
  });

  if (!mailingList) {
    throw notFound("La liste de diffusion n'existe pas");
  }

  if (!canScheduleGenerate(mailingList)) {
    throw conflict("La liste de diffusion ne peut pas être générée");
  }

  await validateMailingListConfiguration(mailingList);

  await getDbCollection("mailingListsV2").updateOne(
    { _id: mailingList._id },
    {
      $set: {
        "progress.generate": 0,
        updated_at: new Date(),
      },
    }
  );

  await getDbCollection("mailingList.computed").deleteMany({ mailing_list_id: mailingList._id });

  await scheduleMailingListJob(mailingList._id, "generate:scheduled");
}
