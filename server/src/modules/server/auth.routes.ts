import Boom from "@hapi/boom";
import { zRoutes } from "shared";
import type { IUser } from "shared/models/user.model";

import { getUserFromRequest } from "../../security/authenticationService";
import { resetPassword, sendResetPasswordEmail, verifyEmailPassword } from "../actions/auth.actions";
import { startSession, stopSession } from "../actions/sessions.actions";
import type { Server } from "./server";

export const authRoutes = ({ server }: { server: Server }) => {
  /**
   * Récupérer l'utilisateur connecté
   */
  server.get(
    "/auth/session",
    {
      schema: zRoutes.get["/auth/session"],
      onRequest: [server.auth(zRoutes.get["/auth/session"])],
    },
    async (request, response) => {
      const user = getUserFromRequest(request, zRoutes.get["/auth/session"]);
      return response.status(200).send(user);
    }
  );

  /**
   * Login
   */
  server.post(
    "/auth/login",
    {
      schema: zRoutes.post["/auth/login"],
    },
    async (request, response) => {
      const { email, password } = request.body;

      const user: IUser | undefined = await verifyEmailPassword(email, password);

      if (!user || !user._id) {
        throw Boom.forbidden("Identifiants incorrects");
      }

      await startSession(user.email, response);

      return response.status(200).send(user);
    }
  );

  server.get(
    "/auth/logout",
    {
      schema: zRoutes.get["/auth/logout"],
    },
    async (request, response) => {
      await stopSession(request, response);

      return response.status(200).send({});
    }
  );

  server.get(
    "/auth/reset-password",
    {
      schema: zRoutes.get["/auth/reset-password"],
    },
    async (request, response) => {
      await sendResetPasswordEmail(request.query.email);
      return response.status(200).send({});
    }
  );

  server.post(
    "/auth/reset-password",
    {
      schema: zRoutes.post["/auth/reset-password"],
      onRequest: [server.auth(zRoutes.post["/auth/reset-password"])],
    },
    async (request, response) => {
      const { password } = request.body;
      const user = getUserFromRequest(request, zRoutes.post["/auth/reset-password"]);

      try {
        await resetPassword(user, password);

        return response.status(200).send({});
      } catch (_error) {
        throw Boom.badData("Jeton invalide");
      }
    }
  );
};
