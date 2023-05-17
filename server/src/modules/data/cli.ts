import { Command } from "commander";
import { MongoClient } from "mongodb";

import { config } from "../../../config/config";
import { modelDescriptors } from "../../db/models";
import {
  configureDbSchemaValidation,
  connectToMongodb,
} from "../../utils/mongodb";
import { createUser } from "../actions/users.actions";
import { migrations } from "./migrations/up";
import { processor } from "./processor/processor";
import { seed } from "./seed/seed";
const program = new Command();

type IJob = (mongoClient: MongoClient) => Promise<void>;

export const runScript = async (job: IJob) => {
  const client = await connectToMongodb(config.mongodb.uri);
  await configureDbSchemaValidation(modelDescriptors);

  await job(client);
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

program
  .command("processor")
  .description("Run processor")
  .action(async () =>
    runScript(async () => {
      await processor();
    })
  );

program
  .command("migrations:up")
  .description("Run migrations up")
  .action(async () =>
    runScript(async (client) => {
      try {
        await migrations(client);
        process.exit(0);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    })
  );

program.parse(process.argv);
