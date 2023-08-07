import { captureException } from "@sentry/node";
import { program } from "commander";
import HttpTerminator from "lil-http-terminator";

import logger from "@/common/logger";
import { closeMongodbConnection } from "@/common/utils/mongodbUtils";
import { server } from "@/modules/server/server";

import {
  closeSentry,
  initSentryProcessor,
} from "./common/services/sentry/sentry";
import config from "./config";
import { addJob, processor } from "./modules/jobs/jobs_actions";

program
  .configureHelp({
    sortSubcommands: true,
  })
  .hook("postAction", async () => {
    await closeMongodbConnection();
    await closeSentry();
  });

async function startProcessor() {
  logger.info(`Process jobs queue - start`);
  await addJob(
    {
      name: "crons:init",
      sync: true,
    },
    { runningLogs: true }
  );
  const abortController = new AbortController();

  await Promise.race([
    processor(abortController.signal),
    new Promise((resolve, reject) => {
      let shutdownInProgress = false;
      ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
        (process as NodeJS.EventEmitter).on(signal, async () => {
          if (shutdownInProgress) {
            const message = `Server shut down (FORCED) (signal=${signal})`;
            logger.warn(message);
            reject(new Error(message));
            return;
          }

          shutdownInProgress = true;
          logger.info(`Processor is shutting down (signal=${signal})`);
          abortController.abort();
        });
      });
    }),
  ]);

  await processor(abortController.signal);
  logger.info(`Processor shut down`);
}

program
  .command("start")
  .option("--withProcessor", "Exécution du processor également")
  .description("Démarre le serveur HTTP")
  .action(async ({ withProcessor = false }) => {
    try {
      await server.listen({ port: config.port, host: "0.0.0.0" });
      logger.info(`Server ready and listening on port ${config.port}`);
      if (withProcessor) {
        await startProcessor();
      }
    } catch (err) {
      logger.error(err);
      captureException(err);
      throw err;
    }

    return new Promise<void>((resolve, reject) => {
      let shutdownInProgress = false;
      ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
        (process as NodeJS.EventEmitter).on(signal, async () => {
          try {
            if (shutdownInProgress) {
              const message = `Server shut down (FORCED) (signal=${signal})`;
              logger.warn(message);
              reject(new Error(message));
              return;
            }

            shutdownInProgress = true;
            logger.warn(`Server shutting down (signal=${signal})`);
            await HttpTerminator({
              server: server.server,
              maxWaitTimeout: 50_000,
              logger: logger,
            }).terminate();
            await closeMongodbConnection();
            logger.warn("Server shut down");
            resolve();
          } catch (err) {
            captureException(err);
            logger.error({ err }, "error during shutdown");
            reject(err);
          }
        });
      });
    });
  });

program
  .command("processor")
  .description("Run job processor")
  .action(async () => {
    initSentryProcessor();
    return startProcessor();
  });

program
  .command("users:create")
  .description("Créer un utilisateur")
  .requiredOption("-e, --email <string>", "Email de l'utilisateur")
  .requiredOption("-p, --password <string>", "Mot de passe de l'utilisateur")
  .requiredOption("-oId, --organisationId <string>", "Organisation Id")
  .option("-a, --admin", "administrateur")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ email, password, organisationId, admin = false, sync }) => {
    const exitCode = await addJob({
      name: "users:create",
      payload: {
        email,
        password,
        is_admin: admin,
        organisation_id: organisationId,
      },
      sync,
    });

    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
  });

program
  .command("seed")
  .description("Seed database")
  .action(async () => {
    const exitCode = await addJob(
      {
        name: "seed",
        sync: true,
      },
      { runningLogs: true }
    );

    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
  });

program
  .command("clear")
  .description("Clear database")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ sync }) => {
    const exitCode = await addJob(
      {
        name: "clear",
        sync,
      },
      { runningLogs: true }
    );

    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
  });

program
  .command("db:validate")
  .description("Validate Documents")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ sync }) => {
    const exitCode = await addJob(
      {
        name: "db:validate",
        sync,
      },
      { runningLogs: true }
    );

    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
  });

program
  .command("migrations:up")
  .description("Run migrations up")
  .action(async () => {
    const exitCode = await addJob(
      {
        name: "migrations:up",
        sync: true,
      },
      { runningLogs: true }
    );
    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
  });

program
  .command("migrations:status")
  .description("Check migrations status")
  .action(async () => {
    const exitCode = await addJob(
      {
        name: "migrations:status",
        sync: true,
      },
      { runningLogs: false }
    );
    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
  });

program
  .command("migrations:create")
  .description("Run migrations create")
  .requiredOption("-d, --description <string>", "description")
  .action(async ({ description }) => {
    const exitCode = await addJob({
      name: "migrations:create",
      payload: { description },
      sync: true,
    });
    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
  });

program
  .command("indexes:recreate")
  .description("Drop and recreate indexes")
  .option("-d, --drop", "Drop indexes before recreating them")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ drop, sync }) => {
    const exitCode = await addJob({
      name: "indexes:recreate",
      payload: { drop },
      sync,
    });
    if (exitCode) {
      program.error("Command failed", { exitCode });
    }
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
