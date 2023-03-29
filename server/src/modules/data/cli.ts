import { Command } from "commander";

import { config } from "../../../config/config";
import { modelDescriptors } from "../../db/models";
import {
  configureDbSchemaValidation,
  connectToMongodb,
} from "../../utils/mongodb";
import { createUser } from "../actions/users.actions";
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
  .action(async ({ email }) =>
    runScript(async () => {
      try {
        const user = await createUser({ email });
        console.log(user);
        process.exit(0);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    })
  );

program.parse(process.argv);
