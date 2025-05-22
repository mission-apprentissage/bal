import { addJob, initJobProcessor } from "job-processor";
import { z } from "zod";

import {
  create as createMigration,
  status as statusMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";

import logger from "../../common/logger";
import { verifyEmails } from "../../common/services/mailer/mailBouncer";
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
import { streamDataToParquetAndS3 } from "./deca/decaToS3";
import { hydrateDeca } from "./deca/hydrate-deca";
import { hydrateLbaBlackListed } from "./lba/hydrate-email-blacklisted";
import { hydrateLbaSiretList } from "./lba/hydrate-siretlist";
import { run_hydrate_from_constructys } from "./validation/hydrate_from_constructys";
import { run_hydrate_from_ocapiat } from "./validation/hydrate_from_ocapiat";
import { run_hydrate_from_deca } from "./validation/hydrate-from-deca";
import { sanitizeOrganisationDomains } from "./validation/organisations_sanitize_domains";

export async function setupJobProcessor() {
  return initJobProcessor({
    db: getDatabase(),
    workerTags: config.worker === "runner-1" ? ["main"] : ["bouncer"],
    logger,
    crons:
      config.env === "preview" || config.env === "local"
        ? {}
        : {
            "Mise à jour des emails blacklisted provenant de la bonne alternance": {
              cron_string: "0 3 * * *",
              handler: () => hydrateLbaBlackListed(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "Cleanup company email": {
              cron_string: "0 3 2 * *",
              handler: () => sanitizeOrganisationDomains(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "Mise à jour des couples siret/email provenant du catalogue de formations": {
              cron_string: "30 2 * * *",
              handler: () => runCatalogueImporter(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "Mise à jour des couples siret/email provenant de l'algo LBA": {
              cron_string: "30 5 10 * *",
              handler: () => hydrateLbaSiretList(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "Mise à jour des données DECA": {
              cron_string: "30 21 * * *",
              handler: async (signal) => {
                await hydrateDeca(signal);
                await run_hydrate_from_deca(0, signal);
                if (config.env === "production") {
                  await streamDataToParquetAndS3();
                }
              },
              resumable: true,
              maxRuntimeInMinutes: 12 * 60,
              // Keep long jobs in the main queue
              tag: "main",
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
      "indexes:recreate": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      "migrations:create": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (job) => createMigration(job.payload as any),
      },
      // BELOW SPECIFIC TO PRODUCT
      "import:document": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (job, signal) => handleDocumentFileContent(job, job.payload as any, signal),
        onJobExited: onImportDocumentJobExited,
        resumable: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      "documents:save-columns": {
        handler: async () => saveDocumentsColumns(),
      },
      "generate:mailing-list": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (job, signal) => handleMailingListJob(job, job.payload as any, signal),
        onJobExited: onMailingListJobExited,
        resumable: true,
      },
      "deca:hydrate": {
        handler: async (_job, signal) => {
          await hydrateDeca(signal);
        },
      },
      "deca:s3:upload": {
        handler: async (_job) => {
          await streamDataToParquetAndS3();
        },
      },
      "import:catalogue": {
        handler: () => runCatalogueImporter(),
      },
      "job:validation:hydrate_from_deca": {
        handler: async (job, signal) => {
          const { offset } = job.payload ?? {};
          return run_hydrate_from_deca(offset ? parseInt(offset.toString(), 10) : 0, signal);
        },
      },
      "email:verify": {
        handler: async (job) => {
          const { emails } = z.object({ emails: z.string().array() }).parse(job.payload);
          const result = await verifyEmails(emails);
          logger.info("Email verification result", { result });
        },
        resumable: true,
        // Keep long jobs in the main queue
        tag: "main",
      },
      "job:validation:hydrate_from_constructys": {
        handler: async () => run_hydrate_from_constructys(),
      },
      "job:validation:hydrate_from_ocapiat": {
        handler: async () => run_hydrate_from_ocapiat(),
      },
      "organisation:sanitize:domains": {
        handler: async () => sanitizeOrganisationDomains(),
      },
      "job:lba:hydrate:email-balcklisted": {
        handler: async () => hydrateLbaBlackListed(),
      },
      "job:lba:hydrate:siret-list": {
        handler: async () => hydrateLbaSiretList(),
      },
    },
  });
}
