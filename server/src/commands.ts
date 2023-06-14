import { program } from "commander";
import HttpTerminator from "lil-http-terminator";

import logger from "@/common/logger";
import { createUser } from "@/modules/actions/users.actions";
import {
  create as createMigration,
  up as upMigration,
} from "@/modules/jobs/migrations/migrations";
import { processor } from "@/modules/jobs/processor/processor";
import { runJob } from "@/modules/jobs/runJob";
import { seed } from "@/modules/jobs/seed/seed";
import { server } from "@/modules/server";
import { closeMongodbConnection } from "@/utils/mongodbUtils";

import { recreateIndexes } from "./modules/jobs/db/recreateIndexes";

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
  .command("users:create")
  .description("Créer un utilisateur")
  .option("-e, --email <string>", "Email de l'utilisateur")
  .option("-p, --password <string>", "Mot de passe de l'utilisateur")
  .option("-oId, --organisationId <string>", "Organisation Id")
  .option("-a, --admin", "administrateur")
  .action(
    runJob(async ({ email, password, organisationId, admin = false }) => {
      await createUser({
        email,
        password,
        is_admin: admin,
        organisation_id: organisationId,
      });
    })
  );

program
  .command("seed")
  .description("Seed env")
  .action(
    runJob(async () => {
      await seed();
    })
  );

program
  .command("processor")
  .description("Run processor")
  .action(async () => {
    logger.warn("starting processor");
    await processor();
  });

program
  .command("migrations:up")
  .description("Run migrations up")
  .action(
    runJob(async () => {
      await upMigration();
    })
  );

program
  .command("migrations:create")
  .description("Run migrations create")
  .option("-d, --description <string>", "description")
  .action(
    runJob(async ({ description }) => {
      await createMigration(description);
    })
  );

program
  .command("indexes:recreate")
  .description("Drop and recreate indexes")
  .option("-d, --drop", "Drop indexes before recreating them")
  .action(
    runJob(async ({ drop }) => {
      await recreateIndexes({ drop });
    })
  );

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
