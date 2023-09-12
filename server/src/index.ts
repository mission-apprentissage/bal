import { captureException } from "@sentry/node";
import { modelDescriptors } from "shared/models/models";

import { startCLI } from "@/commands";
import logger from "@/common/logger";
import { configureDbSchemaValidation, connectToMongodb } from "@/common/utils/mongodbUtils";
import config from "@/config";
import createGlobalServices from "@/services";

(async function () {
  try {
    await connectToMongodb(config.mongodb.uri);
    await configureDbSchemaValidation(modelDescriptors);

    await createGlobalServices();

    startCLI();
  } catch (err) {
    captureException(err);
    logger.error({ err }, "startup error");
    process.exit(1);
  }
})();
