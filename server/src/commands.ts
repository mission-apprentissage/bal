import { setMaxListeners } from "node:events";
import { captureException } from "@sentry/node";
import { program } from "commander";
import { addJob, startJobProcessor } from "job-processor";
import HttpTerminator from "lil-http-terminator";
import { closeMailer } from "./common/services/mailer/mailer";
import { closeSentry } from "./common/services/sentry/sentry";
import { sleep } from "./common/utils/asyncUtils";
import config from "./config";
import createServer from "@/modules/server/server";
import { closeMongodbConnection } from "@/common/utils/mongodbUtils";
import logger from "@/common/logger";

program
  .configureHelp({
    sortSubcommands: true,
  })
  .hook("preAction", (_, actionCommand) => {
    const command = actionCommand.name();
    // on définit le module du logger en global pour distinguer les logs des jobs
    if (command !== "start") {
      logger.fields.module = `cli:${command}`;
    }
  })
  .hook("postAction", async () => {
    await closeMailer();
    await closeMongodbConnection();
    await closeSentry();

    setTimeout(() => {
      // Make sure to exit, even if we didn't close all ressources cleanly
      // eslint-disable-next-line n/no-process-exit
      process.exit(1);
    }, 60_000).unref();
  });

async function startProcessor(signal: AbortSignal) {
  logger.info(`Process jobs queue - start`);
  await startJobProcessor(signal);
  logger.info(`Processor shut down`);
}

function createProcessExitSignal() {
  const abortController = new AbortController();

  let shutdownInProgress = false;
  ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
    (process as NodeJS.EventEmitter).on(signal, async () => {
      try {
        if (shutdownInProgress) {
          const message = `Server shut down (FORCED) (signal=${signal})`;
          logger.warn(message);
          // eslint-disable-next-line n/no-process-exit
          process.exit(1);
        }

        shutdownInProgress = true;
        logger.info(`Server is shutting down (signal=${signal})`);
        abortController.abort();
      } catch (err) {
        captureException(err);
        logger.error({ err }, "error during shutdown");
      }
    });
  });

  const signal = abortController.signal;
  setMaxListeners(100, signal);
  return signal;
}

program
  .command("start")
  .option("--withProcessor", "Exécution du processor également")
  .description("Démarre le serveur HTTP")
  .action(async ({ withProcessor = false }) => {
    try {
      const signal = createProcessExitSignal();

      const server = await createServer();
      await server.listen({ port: config.port, host: "0.0.0.0" });
      logger.info(`Server ready and listening on port ${config.port}`);

      const terminator = HttpTerminator({
        server: server.server,
        maxWaitTimeout: 50_000,
        logger: logger,
      });

      if (signal.aborted) {
        await terminator.terminate();
        return;
      }

      const tasks = [
        new Promise<void>((resolve, reject) => {
          signal.addEventListener("abort", async () => {
            try {
              await terminator.terminate();
              logger.warn("Server shut down");
              resolve();
            } catch (err) {
              reject(err);
            }
          });
        }),
      ];

      if (withProcessor) {
        tasks.push(startProcessor(signal));
      }

      await Promise.all(tasks);
    } catch (err) {
      logger.error(err);
      captureException(err);
      throw err;
    }
  });

program
  .command("processor")
  .description("Run job processor")
  .action(async () => {
    const signal = createProcessExitSignal();
    if (config.disable_processors) {
      // The processor will exit, and be restarted by docker every day
      await sleep(24 * 3_600_000, signal);
      return;
    }

    await startProcessor(signal);
  });

function createJobAction(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (options: any) => {
    try {
      const { queued = false, ...payload } = options;
      const exitCode = await addJob({
        name,
        queued,
        payload,
      });

      if (exitCode) {
        program.error("Command failed", { exitCode });
      }
    } catch (err) {
      logger.error(err);
      program.error("Command failed", { exitCode: 2 });
    }
  };
}

program
  .command("user:create")
  .description("Créer un utilisateur")
  .requiredOption("--email <string>", "Email de l'utilisateur")
  .requiredOption("--password <string>", "Mot de passe de l'utilisateur")
  .option("--admin", "Administrateur")
  .option("--support", "Support")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("user:create"));

program
  .command("db:validate")
  .description("Validate Documents")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("db:validate"));

program
  .command("migrations:up")
  .description("Run migrations up")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("migrations:up"));

program
  .command("migrations:status")
  .description("Check migrations status")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("migrations:status"));

program
  .command("migrations:create")
  .description("Run migrations create")
  .requiredOption("-d, --description <string>", "description")
  .action(createJobAction("migrations:create"));

program
  .command("indexes:recreate")
  .description("Drop and recreate indexes")
  .option("-d, --drop", "Drop indexes before recreating them")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("indexes:recreate"));

program
  .command("deca:hydrate")
  .description("Remplissage des contrats Deca")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("deca:hydrate"));

program
  .command("deca:hydrateSpecific")
  .description("Récupération des infos de date de signature et de flag handicap")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("deca:hydrateSpecific"));

program
  .command("deca:s3:upload")
  .description("DECA to ovh S3")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("deca:s3:upload"));

program
  .command("job:validation:hydrate_from_deca")
  .description("Hydrate organisation and persons from deca")
  .option("--offset <number>", "ignore les X premières lignes DECA")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("job:validation:hydrate_from_deca"));
program
  .command("job:validation:hydrate_from_constructys")
  .description("Hydrate organisation and persons from constructys")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("job:validation:hydrate_from_constructys"));
program
  .command("job:validation:hydrate_from_ocapiat")
  .description("Hydrate organisation and persons from ocapiat")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("job:validation:hydrate_from_ocapiat"));
program
  .command("organisation:sanitize:domains")
  .description("Sanitize organisationdomain")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("organisation:sanitize:domains"));

program
  .command("import:catalogue")
  .description("Importe les paires email/siret depuis le catalogue de formations pour la validation des emails")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("import:catalogue"));

program
  .command("job:lba:hydrate:email-balcklisted")
  .description("Importe liste emails blacklisté lba")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("job:lba:hydrate:email-balcklisted"));

program
  .command("job:lba:hydrate:company-email-list")
  .description("Importe liste emails d'entreprises pour mailing LBA")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("job:lba:hydrate:company-email-list"));

program
  .command("job:lba:verify:company-email-list")
  .description("Vérifie la liste des emails d'entreprises pour mailing LBA")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("job:lba:verify:company-email-list"));

program
  .command("job:lba:enrich:company-email-list")
  .description("Enrichit la liste des emails d'entreprises pour mailing LBA")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("job:lba:enrich:company-email-list"));

program
  .command("hydrate:datagouv")
  .description("Import du fichier des organisations française domaine email")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("hydrate:datagouv"));

program
  .command("email:verify")
  .description("Check if an email is valid")
  .requiredOption("-e, --emails <string...>", "Emails to validate")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("email:verify"));

program
  .command("import:person:deca")
  .description("Update the persons and organisations from deca data")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(createJobAction("import:person:deca"));

program
  .command("job:run")
  .description("Run a job")
  .requiredOption("-n, --name <string>", "Job name")
  .option("-q, --queued", "Run job asynchronously", false)
  .action(async ({ name, ...options }) => {
    return createJobAction(name)(options);
  });

program.hook("preAction", (_, actionCommand) => {
  const command = actionCommand.name();
  // on définit le module du logger en global pour distinguer les logs des jobs
  if (command !== "start") {
    logger.fields.module = `job:${command}`;
  }
});

export async function startCLI() {
  await program.parseAsync(process.argv);
}
