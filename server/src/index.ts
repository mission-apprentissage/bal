import { captureException } from "@sentry/node";
import { modelDescriptors } from "shared/models/models";

import { startCLI } from "@/commands";
import logger from "@/common/logger";
import { configureDbSchemaValidation, connectToMongodb } from "@/common/utils/mongodbUtils";
import config from "@/config";
import createGlobalServices from "@/services";

import { initMailer } from "./common/services/mailer/mailer";

(async function () {
  try {
    await connectToMongodb(config.mongodb.uri);
    await configureDbSchemaValidation(modelDescriptors);

    await createGlobalServices();
    await initMailer();

    startCLI();
  } catch (err) {
    captureException(err);
    logger.error({ err }, "startup error");
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
})();
