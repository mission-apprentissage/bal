import fastifyCors from "@fastify/cors";
import { config } from "config/config";

import { configureDbSchemaValidation, connectToMongodb } from "./db/mongodb";
import { modelDescriptors } from "./models/collections";
import { registerCoreModule } from "./modules/core";
import { userRoutes } from "./modules/core/routes/user.routes";
import { server } from "./server";

(async function () {
  try {
    await connectToMongodb(config.mongodb.uri);
    configureDbSchemaValidation(modelDescriptors);

    server.register(fastifyCors, {});
    server.register(
      async (instance) => {
        registerCoreModule({ server: instance });
        userRoutes({ server: instance });
      },
      { prefix: "/api" }
    );

    server.listen({ port: 5000, host: "0.0.0.0" }, function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  } catch (err) {
    process.exit(1); // eslint-disable-line no-process-exit
  }
})();
