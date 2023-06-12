import config from "@/config";

import { SResGetHealthCheck } from "../../../../shared/routes/core.routes";
import packageJson from "../../../package.json";
import { Server } from ".";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/healthcheck",
    { schema: { response: { 200: SResGetHealthCheck } } },
    async (request, response) => {
      response.status(200).send({
        name: "[BAL] Apprentissage API",
        version: packageJson.version,
        env: config.env,
      });
    }
  );
};
