import { startCLI } from "@/commands";
import logger from "@/common/logger";
import config from "@/config";
import { modelDescriptors } from "@/db/models";
import createGlobalServices from "@/services";
import {
  configureDbSchemaValidation,
  connectToMongodb,
} from "@/utils/mongodbUtils";

process.on("unhandledRejection", (err) =>
  logger.error(err, "unhandledRejection")
);
process.on("uncaughtException", (err) =>
  logger.error(err, "uncaughtException")
);

(async function () {
  try {
    await connectToMongodb(config.mongodb.uri);
    await configureDbSchemaValidation(modelDescriptors);

    await createGlobalServices();

    startCLI();
  } catch (err) {
    logger.error({ err }, "startup error");
    process.exit(1);
  }
})();
