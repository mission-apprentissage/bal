import { zRoutes } from "shared";

import { ensureInitialization } from "../../common/utils/mongodbUtils";
import type { Server } from "./server";
import config from "@/config";

export const coreRoutes = ({ server }: { server: Server }) => {
  server.get("/healthcheck", { schema: zRoutes.get["/healthcheck"] }, async (_request, response) => {
    ensureInitialization();
    response.status(200).send({
      name: "[BAL] Apprentissage API",
      version: config.version,
      env: config.env,
    });
  });
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
