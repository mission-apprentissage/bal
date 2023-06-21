import { IJob, JOB_STATUS_LIST } from "shared/models/job.model";

import logger from "@/common/logger";
import { sleep } from "@/common/utils/asyncUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";
import {
  create as createMigration,
  status as statusMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";

import {
  findDocument,
  handleDocumentFileContent,
} from "../actions/documents.actions";
import { createJob } from "../actions/job.actions";
import {
  findMailingList,
  processMailingList,
} from "../actions/mailingLists.actions";
import { createUser } from "../actions/users.actions";
import { recreateIndexes } from "./db/recreateIndexes";
import { executeJob } from "./executeJob";
import { seed } from "./seed/seed";

export async function addJob(
  { name, payload = {}, scheduled_at = new Date(), sync = false }: any,
  options: { runningLogs: boolean } = {
    runningLogs: true,
  }
) {
  const job = await createJob({
    name,
    payload,
    scheduled_at,
    sync,
  });

  if (sync && job) {
    return runJob(job, options);
  }
}

async function runJob(
  job: IJob,
  options: { runningLogs: boolean } = {
    runningLogs: true,
  }
) {
  return executeJob(
    job,
    async () => {
      switch (job.name) {
        case "seed":
          return seed();
        case "users:create":
          return createUser(job.payload as any);
        case "indexes:recreate":
          return recreateIndexes(job.payload as any);
        case "migrations:up":
          return upMigration();
        case "migrations:status": {
          const pendingMigrations = await statusMigration();
          console.log(
            `migrations-status=${
              pendingMigrations === 0 ? "synced" : "pending"
            }`
          );
          return;
        }
        case "migrations:create":
          return createMigration(job.payload as any);
        case "import:document":
          return async () => {
            const document = await findDocument({
              _id: job.payload?.document_id,
            });
            if (!document) {
              throw new Error("Processor > /document: Can't find document");
            }
            await handleDocumentFileContent(document);
          };
        case "generate:mailing-list":
          return async () => {
            const mailingList = await findMailingList({
              _id: job.payload?.mailing_list_id,
            });
            if (!mailingList) {
              throw new Error(
                "Processor > /mailing-list: Can't find mailing list"
              );
            }
            await processMailingList(mailingList);
          };
        default:
          return Promise.resolve();
      }
    },
    options
  );
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
    await runJob(nextJob as IJob);
  } else {
    await sleep(60000); // 1 min
  }

  return processor();
}
