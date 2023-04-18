import {
  SReqPostUser,
  SResPostUser,
} from "shared/routes/user.routes";

import { createUser } from "../../actions/users.actions";
import { Server } from "..";

// TODO to secure
export const userAdminRoutes = ({ server }: { server: Server }) => {
  /**
   * Créer un utilisateur
   */
  server.post(
    "/admin/user",
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
