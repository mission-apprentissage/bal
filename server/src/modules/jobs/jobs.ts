import { addJob, initJobProcessor } from "job-processor";

import {
  create as createMigration,
  status as statusMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";

import logger from "../../common/logger";
import { getDatabase } from "../../common/utils/mongodbUtils";
import config from "../../config";
import {
  handleDocumentFileContent,
  onImportDocumentJobExited,
  saveDocumentsColumns,
} from "../actions/documents.actions";
import { handleMailingListJob, onMailingListJobExited } from "../actions/mailingLists.actions";
import { createUser } from "../actions/users.actions";
import { runCatalogueImporter } from "./catalogueSiretEmailImport";
import { recreateIndexes } from "./db/recreateIndexes";
import { validateModels } from "./db/schemaValidation";
import { mergeDecaDumps } from "./deca/merge-dumps-deca";
import { createHistory } from "./deca/watcher";

export async function setupJobProcessor() {
  return initJobProcessor({
    db: getDatabase(),
    logger,
    crons:
      config.env === "preview" || config.env === "local"
        ? {}
        : {
            "Mise à jour des contrats deca": {
              cron_string: "30 1 * * *",
              // handler: async (job) => hydrateDeca(job.payload as any)
              handler: () => {
                return Promise.resolve(1);
              },
            },
            "Mise à jour des couples siret/email provenant du catalogue de formations": {
              cron_string: "30 2 * * *",
              handler: () => runCatalogueImporter(),
            },
          },
    jobs: {
      "users:create": {
        handler: async (job) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { organisationId, admin, support, ...rest } = job.payload as any;
          await createUser({
            organisation_id: organisationId,
            ...(admin ? { is_admin: admin } : {}),
            ...(support ? { is_support: support } : {}),
            ...rest,
          });
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "indexes:recreate": {
        handler: async (job) => recreateIndexes(job.payload as any),
      },
      "db:validate": {
        handler: async () => validateModels(),
      },
      "migrations:up": {
        handler: async () => {
          await upMigration();
          // Validate all documents after the migration
          await addJob({ name: "db:validate", queued: true });
          return;
        },
      },
      "migrations:status": {
        handler: async () => {
          const pendingMigrations = await statusMigration();
          console.log(`migrations-status=${pendingMigrations === 0 ? "synced" : "pending"}`);
          return;
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "migrations:create": {
        handler: async (job) => createMigration(job.payload as any),
      },
      // BELOW SPECIFIC TO PRODUCT
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "import:document": {
        handler: async (job, signal) => handleDocumentFileContent(job, job.payload as any, signal),
        onJobExited: onImportDocumentJobExited,
        resumable: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "documents:save-columns": {
        handler: async () => saveDocumentsColumns(),
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "generate:mailing-list": {
        handler: async (job, signal) => handleMailingListJob(job, job.payload as any, signal),
        onJobExited: onMailingListJobExited,
        resumable: true,
      },

      "deca:merge": {
        handler: async () => mergeDecaDumps(),
      },
      "deca:history": {
        handler: async () => createHistory(),
      },
      "import:catalogue": {
        handler: () => runCatalogueImporter(),
      },
    },
  });
}
