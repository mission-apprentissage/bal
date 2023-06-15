import { program } from "commander";
import HttpTerminator from "lil-http-terminator";

import logger from "@/common/logger";
import { closeMongodbConnection } from "@/common/utils/mongodbUtils";
import { server } from "@/modules/server/server";

import { createJob } from "./modules/actions/job.actions";
import { processor } from "./modules/jobs/jobs";

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
  .option("-e, --email <string>", "Email de l'utilisateur")
  .option("-p, --password <string>", "Mot de passe de l'utilisateur")
  .option("-oId, --organisationId <string>", "Organisation Id")
  .option("-a, --admin", "administrateur")
  .action(async ({ email, password, organisationId, admin = false }) => {
    await createJob({
      name: "users:create",
      payload: {
        email,
        password,
        is_admin: admin,
        organisation_id: organisationId,
      },
    });
    process.exit(0);
  });

program
  .command("seed")
  .description("Seed env")
  .action(async () => {
    await createJob({
      name: "seed",
    });
    process.exit(0);
  });

program
  .command("migrations:up")
  .description("Run migrations up")
  .action(async () => {
    await createJob({
      name: "migrations:up",
    });
    process.exit(0);
  });

program
  .command("migrations:create")
  .description("Run migrations create")
  .option("-d, --description <string>", "description")
  .action(async ({ description }) => {
    await createJob({
      name: "migrations:create",
      payload: description,
    });
    process.exit(0);
  });

program
  .command("indexes:recreate")
  .description("Drop and recreate indexes")
  .option("-d, --drop", "Drop indexes before recreating them")
  .action(async ({ drop }) => {
    await createJob({
      name: "indexes:recreate",
      payload: { drop },
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
