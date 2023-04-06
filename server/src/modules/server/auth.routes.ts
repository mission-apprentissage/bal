import bcrypt from "bcrypt";
import { SReqPostLogin, SResPostLogin } from "shared/routes/auth.routes";
import { SResError } from "shared/routes/common.routes";

import { findUser } from "../actions/users.actions";
import { Server } from ".";

export const authRoutes = ({ server }: { server: Server }) => {
  /**
   * Récupérer l'utilisateur connecté
   */
  server.post(
    "/auth/login",
    {
      schema: {
        body: SReqPostLogin,
        response: {
          200: SResPostLogin,
          401: SResError,
        },
      } as const,
    },
    async (request, response) => {
      const { email, password } = request.body;

      const user = await findUser({ email });

      if (!user) {
        return response.status(401).send({
          type: "invalid_credentials",
          message: "Identifiants incorrects.",
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return response.status(401).send({
          type: "invalid_credentials",
          message: "Identifiants incorrects.",
        });
      }

      request.session.set("userId", user._id);

      return response.status(200).send(user);
    }
  );
};
