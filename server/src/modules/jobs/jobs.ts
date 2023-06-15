import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import logger from "@/common/logger";
import { sleep } from "@/common/utils/asyncUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";
import {
  create as createMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";

import {
  findDocument,
  handleDocumentFileContent,
} from "../actions/documents.actions";
import {
  findMailingList,
  processMailingList,
} from "../actions/mailingLists.actions";
import { createUser } from "../actions/users.actions";
import { recreateIndexes } from "./db/recreateIndexes";
import { runJob } from "./runJob";
import { seed } from "./seed/seed";

async function executeJob(job: IJob) {
  switch (job.name) {
    case "seed":
      await runJob(job, async () => {
        await seed();
      });
      break;
    case "migrations:up":
      await runJob(job, async () => {
        await upMigration();
      });
      break;
    case "migrations:create":
      await runJob(job, async () => {
        await createMigration(job.payload as any);
      });
      break;
    case "users:create":
      await runJob(job, async () => {
        await createUser(job.payload as any);
      });
      break;
    case "indexes:recreate":
      await runJob(job, async () => {
        await recreateIndexes(job.payload as any);
      });
      break;
    case "import:document":
      await runJob(job, async () => {
        const document = await findDocument({
          _id: job.payload?.document_id,
        });
        if (!document) {
          throw new Error("Processor > /document: Can't find document");
        }
        await handleDocumentFileContent(document);
      });
      break;
    case "generate:mailing-list":
      await runJob(job, async () => {
        const mailingList = await findMailingList({
          _id: job.payload?.mailing_list_id,
        });
        if (!mailingList) {
          throw new Error("Processor > /mailing-list: Can't find mailing list");
        }
        await processMailingList(mailingList);
      });
      break;

    default:
      break;
  }
}

//abortSignal
export async function processor() {
  logger.info(`Process jobs queue - looking for a job to execute`);
  const { value: nextJob } = (await getDbCollection("jobs").findOneAndUpdate(
    { status: JOB_STATUS_LIST.PENDING, scheduled_at: { $lte: new Date() } },
    { $set: { status: JOB_STATUS_LIST.WILLSTART } },
    { sort: { scheduled_at: 1 } }
  )) as any;

  if (nextJob) {
    logger.info(`Process jobs queue - job ${nextJob.name} will start`);
    await executeJob(nextJob as IJob);
  } else {
    await sleep(60000); // 1 min
  }

  return processor();
}

// {
//   name
//   status // JOB_STATUS_LIST
//   payload
//   scheduled_at
//   started_at
//   ended_at
//   updated_at
//   created_at
// }
// export enum JOB_STATUS_LIST {
//   PENDING = "pending",
//   FINISHED = "finished",
//   RUNNING = "running",
//   BLOCKED = "blocked",
//   ERRORED = "errored",
// }
