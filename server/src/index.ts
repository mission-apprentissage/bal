import { config } from "config/config";

import { modelDescriptors } from "./db/models";
import { server } from "./modules/server";
import createGlobalServices from "./services";
import { configureDbSchemaValidation, connectToMongodb } from "./utils/mongodb";
(async function () {
  try {
    await connectToMongodb(config.mongodb.uri);
    await configureDbSchemaValidation(modelDescriptors);

    await createGlobalServices();

    server.listen({ port: 5000, host: "0.0.0.0" }, function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  } catch (err) {
    process.exit(1);
  }
})();
