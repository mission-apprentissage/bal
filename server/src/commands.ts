import { program } from "commander";
import HttpTerminator from "lil-http-terminator";

import logger from "@/common/logger";
import { closeMongodbConnection } from "@/common/utils/mongodbUtils";
import { server } from "@/modules/server/server";

import { addJob, processor } from "./modules/jobs/jobs";

program.configureHelp({
  sortSubcommands: true,
});

program
  .command("start")
  .description("Démarre le serveur HTTP")
  .action(async () => {
    server.listen({ port: 5000, host: "0.0.0.0" }, function (err) {
      logger.info(`Server ready and listening on port ${5000}`);
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });

    let shutdownInProgress = false;
    ["SIGINT", "SIGTERM", "SIGQUIT"].forEach((signal) => {
      (process as NodeJS.EventEmitter).on(signal, async () => {
        try {
          if (shutdownInProgress) {
            logger.warn(`application shut down (FORCED) (signal=${signal})`);
            process.exit(0); // eslint-disable-line no-process-exit
          }
          shutdownInProgress = true;
          logger.warn(`application shutting down (signal=${signal})`);
          await HttpTerminator({
            server: server.server,
            maxWaitTimeout: 50_000,
            logger: logger,
          }).terminate();
          await closeMongodbConnection();
          logger.warn("application shut down");
          process.exit(0); // eslint-disable-line no-process-exit
        } catch (err) {
          logger.error({ err }, "error during shutdown");
          process.exit(1); // eslint-disable-line no-process-exit
        }
      });
    });
  });

program
  .command("processor")
  .description("Run job processor")
  .action(async () => {
    logger.info(`Process jobs queue - start`);
    await processor();
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
    await addJob({
      name: "users:create",
      payload: {
        email,
        password,
        is_admin: admin,
        organisation_id: organisationId,
      },
      sync,
    });
    process.exit(0);
  });

program
  .command("seed")
  .description("Seed env")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ sync }) => {
    await addJob(
      {
        name: "seed",
        sync,
      },
      { runningLogs: false }
    );
    process.exit(0);
  });

program
  .command("migrations:up")
  .description("Run migrations up")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ sync }) => {
    await addJob(
      {
        name: "migrations:up",
        sync,
      },
      { runningLogs: false }
    );
    process.exit(0);
  });

program
  .command("migrations:create")
  .description("Run migrations create")
  .requiredOption("-d, --description <string>", "description")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ description, sync }) => {
    await addJob({
      name: "migrations:create",
      payload: description,
      sync,
    });
    process.exit(0);
  });

program
  .command("indexes:recreate")
  .description("Drop and recreate indexes")
  .option("-d, --drop", "Drop indexes before recreating them")
  .option("-s, --sync", "Run job synchronously")
  .action(async ({ drop, sync }) => {
    await addJob({
      name: "indexes:recreate",
      payload: { drop },
      sync,
    });
    process.exit(0);
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
