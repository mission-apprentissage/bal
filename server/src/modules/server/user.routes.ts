import { IUser } from "shared/models/user.model";
import { SResGetGenerateApiKey } from "shared/routes/user.routes";

import { generateApiKey } from "../actions/users.actions";
import { Server } from "./server";

export const userRoutes = ({ server }: { server: Server }) => {
  /**
   * Génerer une clé API
   */
  server.get(
    "/user/generate-api-key",
    {
      schema: {
        response: { 200: SResGetGenerateApiKey },
      } as const,
      preHandler: server.auth([
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const api_key = await generateApiKey(request.user as IUser);

      return response.status(200).send({ api_key });
    }
  );
};
