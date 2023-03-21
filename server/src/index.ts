import fastifyCors from "@fastify/cors";
import { config } from "config/config";

import { connectToMongodb } from "./db/mongodb";
import { registerCoreModule } from "./modules/core";
import { server } from "./server";


(async function () {
  try {
    await connectToMongodb(config.mongodb.uri);

    server.register(fastifyCors, {});
    server.register(
      async (instance) => {
        registerCoreModule({ server: instance });
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


