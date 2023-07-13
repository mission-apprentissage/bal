import config from "@/config";

import { SResGetHealthCheck } from "../../../../shared/routes/core.routes";
import packageJson from "../../../package.json";
import { ensureInitialization } from "../../common/utils/mongodbUtils";
import { Server } from "./server";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/healthcheck",
    { schema: { response: { 200: SResGetHealthCheck } } },
    async (request, response) => {
      await ensureInitialization();
      response.status(200).send({
        name: "[BAL] Apprentissage API",
        version: packageJson.version,
        env: config.env,
      });
    }
  );
  server.get(
    "/test-sentry",
    { schema: { response: { 200: SResGetHealthCheck } } },
    async () => {
      throw new Error("testing sentry error");
    }
  );
};
