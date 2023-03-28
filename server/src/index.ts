import { config } from "config/config";

import { configureDbSchemaValidation, connectToMongodb } from "./db/mongodb";
import { server } from "./server";

(async function () {
  try {
    await connectToMongodb(config.mongodb.uri);
    await configureDbSchemaValidation();

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
