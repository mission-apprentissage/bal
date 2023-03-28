import { Command } from "commander";
import { ObjectId } from "mongodb";

import { config } from "../../config/config";
import { configureDbSchemaValidation, connectToMongodb } from "../db/mongodb";
import { createUser } from "../services/userService";
import { standAloneJWTSign } from "../utils/auth";
const program = new Command();

type IJob = () => Promise<void>;

export const runScript = async (job: IJob) => {
  await connectToMongodb(config.mongodb.uri);
  await configureDbSchemaValidation();

  await job();
};

program
  .command("users:create")
  .description("Créer un utilisateur")
  .option("-e, --email <string>", "Email de l'utilisateur")
  .action(async ({ email }) =>
    runScript(async () => {
      const _id = new ObjectId();
      const data = {
        _id,
        email,
        token: standAloneJWTSign({ userId: _id, email }),
      };

      try {
        const user = await createUser(data);
        console.log(user);
        process.exit(0);
      } catch (error) {
        console.error(error);
        process.exit(1);
      }
    })
  );

program.parse(process.argv);
