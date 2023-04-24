import { SResGetGenerateApiKey } from "shared/routes/user.routes";

import { generateApiKey } from "../actions/users.actions";
import { Server } from ".";

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
      try {
        if (!request.user) {
          throw new Error("User not found");
        }

        const key = await generateApiKey(request.user);

        return response.status(200).send({ apiKey: key });
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
