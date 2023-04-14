import { config } from "../../../config/config";
import packageJson from "../../../package.json";
import { Server } from ".";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get("/", async (request, response) => {
    response.status(200).send({ 
      name: "BAL Apprentissage API",
      version: packageJson.version,
      env: config.env,
     });
  });
  server.get("/healthcheck", async (request, response) => {
    response.status(200).send({ 
      name: "BAL Apprentissage API",
      version: packageJson.version,
      env: config.env,
     });
  });
};
