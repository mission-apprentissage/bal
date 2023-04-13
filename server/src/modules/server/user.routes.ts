import {
  SReqHeadersUser,
  SReqPostUser,
  SResGetUser,
  SResPostUser,
} from "shared/routes/user.routes";

import { createUser } from "../actions/users.actions";
import { Server } from ".";

export const userRoutes = ({ server }: { server: Server }) => {
  /**
   * Récupérer l'utilisateur connecté
   */
  server.get(
    "/user",
    {
      schema: {
        response: { 200: SResGetUser },
        headers: SReqHeadersUser,
      } as const,
      preHandler: server.auth([server.validateJWT, server.validateSession]),
    },
    async (request, response) => {
      return response.status(200).send(request.user);
    }
  );

  /**
   * Créer un utilisateur
   */
  server.post(
    "/user",
    {
      schema: {
        body: SReqPostUser,
        response: { 200: SResPostUser },
      } as const,
    },
    async (request, response) => {
      try {
        const user = await createUser(request.body);

        if (!user) {
          throw new Error("User not created");
        }

        return response.status(200).send(user);
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
