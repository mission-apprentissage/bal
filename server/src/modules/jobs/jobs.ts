import { addJob, initJobProcessor } from "job-processor";
import { z } from "zod/v4-mini";

import logger from "../../common/logger";
import { verifyEmails } from "../../common/services/mailer/mailBouncer";
import { getDatabase } from "../../common/utils/mongodbUtils";
import config from "../../config";
import { createUser } from "../actions/users.actions";
import { sanitizeOrganisationDomains } from "../actions/organisations.actions";
import { importPersonFromCatalogue } from "./catalogueSiretEmailImport";
import { recreateIndexes } from "./db/recreateIndexes";
import { validateModels } from "./db/schemaValidation";
import { streamDataToParquetAndS3 } from "./deca/decaToS3";
import { hydrateDeca } from "./deca/hydrate-deca";
import { hydrateLbaBlackListed } from "./lba/hydrate-email-blacklisted";
import { importPersonFromAlgoLba } from "./lba/hydrate-siretlist";
import { importCompanyEmailsForLbaMailing } from "./lba/hydrate-companyEmailList";
import { importPersonFromDeca } from "./validation/hydrate-from-deca";
import { anonymisationService } from "./anonymisation/anonymisation.service";
import { updateDecaSpecificFields } from "./deca/update-deca-specific-fields";
import {
  onMailingListV2JobExited,
  processMailingList,
  recoverMailingListJobs,
} from "./mailing-list/mailing-list.processor";
import { hydrateDataGouv } from "./lba/hydrate-datagouv";
import {
  create as createMigration,
  status as statusMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";

export async function setupJobProcessor() {
  return initJobProcessor({
    db: getDatabase(),
    workerTags: config.worker === "runner-1" ? ["main"] : ["bouncer"],
    logger,
    crons:
      config.env === "preview" || config.env === "local"
        ? {}
        : {
            "MAJ emails blacklist la bonne alternance": {
              cron_string: "0 3 * * *",
              handler: async () => hydrateLbaBlackListed(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "Nettoyage emails génériques": {
              cron_string: "0 3 2 * *",
              handler: async () => sanitizeOrganisationDomains(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "MAJ couples siret-email catalogue RCO": {
              cron_string: "30 2 * * *",
              handler: async () => importPersonFromCatalogue(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "MAJ couples siret-email algo LBA": {
              cron_string: "30 5 10 * *",
              handler: async () => importPersonFromAlgoLba(),
              resumable: true,
              maxRuntimeInMinutes: 60,
            },
            "MAJ données DECA": {
              cron_string: "30 21 * * *",
              handler: async (signal) => {
                await hydrateDeca(signal);
                if (config.env === "production") {
                  await streamDataToParquetAndS3();
                }
                await importPersonFromDeca(signal);
              },
              resumable: true,
              maxRuntimeInMinutes: 12 * 60,
              // Keep long jobs in the main queue
              tag: "main",
            },
            "Anonymisation données DECA": {
              cron_string: "0 8 * * *",
              handler: anonymisationService,
              resumable: true,
              maxRuntimeInMinutes: 15,
            },
            "Récupération mailing-lists": {
              cron_string: "*/30 * * * *",
              handler: recoverMailingListJobs,
              resumable: true,
              maxRuntimeInMinutes: 15,
            },
            "Récupération couples siret-email datagouv": {
              cron_string: "0 10 * * SUN",
              handler: hydrateDataGouv,
              maxRuntimeInMinutes: 15,
            },
          },
    jobs: {
      "user:create": {
        handler: async (job) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { admin, support, ...rest } = job.payload as any;
          return createUser({
            ...rest,
            is_admin: admin ?? false,
            is_support: support ?? false,
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
          const { count, requireShutdown } = await statusMigration();
          if (count === 0) {
            console.log("migrations-status=synced");
          } else {
            console.log(`migrations-status=${requireShutdown ? "require-shutdown" : "pending"}`);
          }
          return;
        },
      },
      "migrations:create": {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (job) => createMigration(job.payload as any),
      },
      "deca:hydrate": {
        handler: async (_job, signal) => {
          await hydrateDeca(signal);
        },
      },
      "deca:hydrateSpecific": {
        handler: async (_job, signal) => {
          await updateDecaSpecificFields(signal);
        },
        tag: "bouncer",
      },
      "deca:s3:upload": {
        handler: async (_job) => {
          await streamDataToParquetAndS3();
        },
      },
      "import:person:catalogue": {
        handler: async () => importPersonFromCatalogue(),
      },
      "import:person:deca": {
        handler: async (_job, signal) => {
          return importPersonFromDeca(signal);
        },
      },
      "import:person:algo-lba": {
        handler: async () => importPersonFromAlgoLba(),
      },
      anonymisation: {
        handler: anonymisationService,
      },
      "email:verify": {
        handler: async (job, signal) => {
          const { emails } = z.object({ emails: z.array(z.string()) }).parse(job.payload);
          const result = await verifyEmails(emails, signal);
          logger.info("Email verification result", { result });
        },
        resumable: true,
        // Keep long jobs in the main queue
        tag: "main",
      },
      "organisation:sanitize:domains": {
        handler: async () => sanitizeOrganisationDomains(),
      },
      "job:lba:hydrate:email-balcklisted": {
        handler: async () => hydrateLbaBlackListed(),
      },
      "job:lba:hydrate:company-email-list": {
        handler: async () => importCompanyEmailsForLbaMailing(),
      },
      "mailing-list:process": {
        handler: processMailingList,
        onJobExited: onMailingListV2JobExited,
        resumable: true,
      },
      "mailing-list:recover": {
        handler: async (_job, signal) => recoverMailingListJobs(signal),
        resumable: true,
      },
      "hydrate:datagouv": {
        handler: hydrateDataGouv,
      },
    },
  });
}
