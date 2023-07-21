import { IJobDocument, JOB_STATUS_LIST } from "shared/models/job.model";

import logger from "@/common/logger";
import { sleep } from "@/common/utils/asyncUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";
import {
  create as createMigration,
  status as statusMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";

import { handleDocumentFileContent } from "../actions/documents.actions";
import { createJob } from "../actions/job.actions";
import { processMailingList } from "../actions/mailingLists.actions";
import { createUser } from "../actions/users.actions";
import { recreateIndexes } from "./db/recreateIndexes";
import { validateModels } from "./db/schemaValidation";
import { executeJob } from "./executeJob";
import { clear } from "./seed/clear";
import { seed } from "./seed/seed";

export async function addJob(
  { name, payload = {}, scheduled_at = new Date(), sync = false },
  options: { runningLogs: boolean } = {
    runningLogs: true,
  }
): Promise<number> {
  const job = await createJob({
    name,
    payload,
    scheduled_at,
    sync,
  });

  if (sync && job) {
    return runJob(job, options);
  }

  return 0;
}

async function runJob(
  job: IJobDocument,
  options: { runningLogs: boolean } = {
    runningLogs: true,
  }
): Promise<number> {
  return executeJob(
    job,
    async () => {
      switch (job.name) {
        case "seed":
          return seed();
        case "clear":
          return clear();
        case "users:create":
          return createUser(job.payload as any);
        case "indexes:recreate":
          return recreateIndexes(job.payload as any);
        case "db:validate":
          return validateModels();
        case "migrations:up": {
          await upMigration();
          // Validate all documents after the migration
          await addJob({ name: "db:validate" });
          return;
        }
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
          return handleDocumentFileContent(job.payload as any);
        case "generate:mailing-list":
          return processMailingList(job.payload as any);
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
  const { value: nextJob } = await getDbCollection("jobs").findOneAndUpdate(
    { status: JOB_STATUS_LIST.PENDING, scheduled_at: { $lte: new Date() } },
    { $set: { status: JOB_STATUS_LIST.WILLSTART } },
    { sort: { scheduled_at: 1 } }
  );

  if (nextJob) {
    logger.info(`Process jobs queue - job ${nextJob.name} will start`);
    await runJob(nextJob);
  } else {
    await sleep(60000); // 1 min
  }

  return processor();
}
