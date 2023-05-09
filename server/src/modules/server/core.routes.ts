import { SResGetHealthCheck } from "../../../../shared/routes/core.routes";
import { config } from "../../../config/config";
import packageJson from "../../../package.json";
import { Server } from ".";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/",
    { schema: { response: { 200: SResGetHealthCheck } } },
    async (request, response) => {
      response.status(200).send({
        name: "BAL Apprentissage API ",
        version: packageJson.version,
        env: config.env,
      });
    }
  );
  server.get(
    "/healthcheck",
    { schema: { response: { 200: SResGetHealthCheck } } },
    async (request, response) => {
      response.status(200).send({
        name: "BAL Apprentissage API",
        version: packageJson.version,
        env: config.env,
      });
    }
  );
};
