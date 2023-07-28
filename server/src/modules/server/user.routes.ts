import { forbidden } from "@hapi/boom";
import { zRoutes } from "shared";

import { generateApiKey } from "../actions/users.actions";
import { Server } from "./server";

export const userRoutes = ({ server }: { server: Server }) => {
  /**
   * Génerer une clé API
   */
  server.get(
    "/user/generate-api-key",
    {
      schema: zRoutes.get["/user/generate-api-key"],
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      if (!request.user) {
        throw forbidden();
      }
      const api_key = await generateApiKey(request.user);
      return response.status(200).send({ api_key });
    }
  );
};
