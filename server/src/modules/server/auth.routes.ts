import Boom, { forbidden } from "@hapi/boom";
import { zRoutes } from "shared";
import { IUserWithPerson, toPublicUser } from "shared/models/user.model";

import config from "@/config";

import { createUserTokenSimple } from "../../common/utils/jwtUtils";
import { resetPassword, sendResetPasswordEmail, verifyEmailPassword } from "../actions/auth.actions";
import { createSession, deleteSession } from "../actions/sessions.actions";
import { Server } from "./server";

export const authRoutes = ({ server }: { server: Server }) => {
  /**
   * Récupérer l'utilisateur connecté
   */
  server.get(
    "/auth/session",
    {
      schema: zRoutes.get["/auth/session"],
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      if (!request.user) {
        throw forbidden();
      }
      return response.status(200).send(toPublicUser(request.user));
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

      const user: IUserWithPerson | undefined = await verifyEmailPassword(email, password);

      if (!user || !user._id) {
        throw Boom.forbidden("Identifiants incorrects");
      }

      const token = createUserTokenSimple({ payload: { email: user.email } });
      await createSession({ token });

      return response
        .setCookie(config.session.cookieName, token, config.session.cookie)
        .status(200)
        .send(toPublicUser(user));
    }
  );

  server.get(
    "/auth/logout",
    {
      schema: zRoutes.get["/auth/logout"],
    },
    async (request, response) => {
      const token = request.cookies[config.session.cookieName];

      if (token) {
        await deleteSession(token);

        return response.clearCookie(config.session.cookieName, config.session.cookie).status(200).send({});
      }

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
    },
    async (request, response) => {
      const { password, token } = request.body;

      try {
        await resetPassword(password, token);

        return response.status(200).send({});
      } catch (error) {
        throw Boom.badData("Jeton invalide");
      }
    }
  );
};
