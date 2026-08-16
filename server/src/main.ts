import { captureException } from "@sentry/node"
import { modelDescriptors } from "shared/models/models"
import { startCLI } from "@/commands"
import logger from "@/common/logger"
import { closeSentry } from "@/common/services/sentry/sentry"
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
    logger.error({ err }, "cli error")
    // le hook `postAction` de commander ne s'exécute pas quand `parseAsync` rejette :
    // sans ce flush, l'événement Sentry est perdu par le `process.exit` qui suit.
    await closeSentry()
    process.exit(1)
  }
})()
