import { exec as nodeexec } from "node:child_process";
import util from "node:util";

import { IJob } from "shared/models/job.model";
const exec = util.promisify(nodeexec);

import {
  create as createMigration,
  status as statusMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";

import logger from "../../common/logger";
import { handleDocumentFileContent, saveDocumentsColumns } from "../actions/documents.actions";
import { handleMailingListJob } from "../actions/mailingLists.actions";
import { createUser } from "../actions/users.actions";
import { cronsInit, cronsScheduler } from "./crons_actions";
import { recreateIndexes } from "./db/recreateIndexes";
import { validateModels } from "./db/schemaValidation";
import { addJob, executeJob } from "./jobs_actions";
import { clear } from "./seed/clear";
import { seed } from "./seed/seed";

interface CronDef {
  name: string;
  cron_string: string;
  handler: () => Promise<number>;
}

export const CRONS: Record<string, CronDef> = {
  "Run daily jobs each day at 02h30": {
    name: "Run daily jobs each day at 02h30",
    cron_string: "30 2 * * *",
    handler: async () => {
      const { stdout, stderr } = await exec("/opt/app/scripts/run-dummy-outside-job.sh");
      logger.info("stdout:", stdout);
      logger.error("stderr:", stderr);
      return stderr ? 1 : 0;
    },
  },
};

export async function runJob(job: IJob): Promise<number> {
  return executeJob(job, async () => {
    if (job.type === "cron_task") {
      return CRONS[job.name].handler();
    }
    switch (job.name) {
      case "seed":
        return seed();
      case "clear":
        return clear();
      case "users:create":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return createUser(job.payload as any);
      case "indexes:recreate":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return recreateIndexes(job.payload as any);
      case "db:validate":
        return validateModels();
      case "migrations:up": {
        await upMigration();
        // Validate all documents after the migration
        await addJob({ name: "db:validate", queued: true });
        return;
      }
      case "migrations:status": {
        const pendingMigrations = await statusMigration();
        console.log(`migrations-status=${pendingMigrations === 0 ? "synced" : "pending"}`);
        return;
      }
      case "migrations:create":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return createMigration(job.payload as any);
      case "crons:init": {
        await cronsInit();
        return;
      }
      case "crons:scheduler":
        return cronsScheduler();

      // BELOW SPECIFIC TO PRODUCT
      case "import:document":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handleDocumentFileContent(job.payload as any);
      case "documents:save-columns":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return saveDocumentsColumns();
      case "generate:mailing-list":
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return handleMailingListJob(job.payload as any);
      default: {
        logger.warn(`Job not found ${job.name}`);
      }
    }
  });
}
