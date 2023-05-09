import { Command } from "commander";

import { config } from "../../../config/config";
import { modelDescriptors } from "../../db/models";
import {
  configureDbSchemaValidation,
  connectToMongodb,
} from "../../utils/mongodb";
import { createUser } from "../actions/users.actions";
import { migration1 } from "./migrations/migration-1";
import { processor } from "./processor/processor";
import { seed } from "./seed/seed";
const program = new Command();

type IJob = () => Promise<void>;

export const runScript = async (job: IJob) => {
  await connectToMongodb(config.mongodb.uri);
  await configureDbSchemaValidation(modelDescriptors);

  await job();
};

program
  .command("users:create")
  .description("Créer un utilisateur")
  .option("-e, --email <string>", "Email de l'utilisateur")
  .option("-p, --password <string>", "Mot de passe de l'utilisateur")
  .option("-oId, --organisationId <string>", "Organisation Id")
  .option("-a, --admin", "administrateur")
  .action(async ({ email, password, organisationId, admin = false }) =>
    runScript(async () => {
      try {
        await createUser({
          email,
          password,
          is_admin: admin,
          organisation_id: organisationId,
        });
        process.exit(0);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    })
  );

program
  .command("seed")
  .description("Seed env")
  .action(async () =>
    runScript(async () => {
      try {
        await seed();
        process.exit(0);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    })
  );

program.command("migration").action(async () =>
  runScript(async () => {
    try {
      await migration1();
      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  })
);

program
  .command("processor")
  .description("Run processor")
  .action(async () =>
    runScript(async () => {
      await processor();
    })
  );

program.parse(process.argv);
