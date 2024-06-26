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
import { hydrateDeca } from "./deca/hydrate-deca";
import { run_hydrate_from_constructys } from "./validation/hydrate_from_constructys";
import { run_hydrate_from_ocapiat } from "./validation/hydrate_from_ocapiat";
import { run_hydrate_from_deca } from "./validation/hydrate-from-deca";
import { run_organisations_sanitize_domains } from "./validation/organisations_sanitize_domains";

export async function setupJobProcessor() {
  return initJobProcessor({
    db: getDatabase(),
    logger,
    crons:
      config.env === "preview" || config.env === "local"
        ? {}
        : {
            "Mise à jour des couples siret/email provenant du catalogue de formations": {
              cron_string: "30 2 * * *",
              handler: () => runCatalogueImporter(),
            },
            "Mise à jour des données DECA": {
              cron_string: "30 4 * * *",
              handler: () => hydrateDeca({ from: "", to: "", chunk: 1 }),
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
      "deca:hydrate": {
        handler: async (job) => {
          const { from, to, chunk } = job.payload as any;
          await hydrateDeca({ from, to, chunk });
        },
      },
      "import:catalogue": {
        handler: () => runCatalogueImporter(),
      },
      "job:validation:hydrate_from_deca": {
        handler: async (job) => {
          const { offset } = job.payload ?? {};
          return run_hydrate_from_deca(offset ? parseInt(offset.toString(), 10) : 0);
        },
      },
      "job:validation:hydrate_from_constructys": {
        handler: async () => run_hydrate_from_constructys(),
      },
      "job:validation:hydrate_from_ocapiat": {
        handler: async () => run_hydrate_from_ocapiat(),
      },
      "organisation:sanitize:domains": {
        handler: async () => run_organisations_sanitize_domains(),
      },
    },
  });
}
