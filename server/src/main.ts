import { captureException } from "@sentry/node"
import { modelDescriptors } from "shared/models/models"
import { startCLI } from "@/commands"
import logger from "@/common/logger"
import { configureDbSchemaValidation, connectToMongodb } from "@/common/utils/mongodbUtils"
import config from "@/config"
import createGlobalServices from "@/services"
import { initMailer } from "./common/services/mailer/mailer"
import { setupJobProcessor } from "./modules/jobs/jobs"

void (async function () {
  try {
    await connectToMongodb(config.mongodb.uri)
    await configureDbSchemaValidation(modelDescriptors)

    // We need to setup even for server to be able to call addJob
    await setupJobProcessor()

    await createGlobalServices()
    await initMailer()

    await startCLI()
  } catch (err) {
    captureException(err)
    logger.error({ err }, "startup error")
    process.exit(1)
  }
})()
