import { zRoutes } from "shared";

import config from "@/config";

import { ensureInitialization } from "../../common/utils/mongodbUtils";
import { Server } from "./server";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/healthcheck",
    { schema: zRoutes.get["/healthcheck"] },
    async (request, response) => {
      await ensureInitialization();
      response.status(200).send({
        name: "[BAL] Apprentissage API",
        version: config.version,
        env: config.env,
      });
    }
  );
  server.get(
    "/healthcheck/sentry",
    {
      schema: zRoutes.get["/healthcheck/sentry"],
    },
    async () => {
      throw new Error("testing sentry error");
    }
  );
};
