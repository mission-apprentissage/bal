import {
  IResPostLogin,
  SReqGetResetPassword,
  SReqHeadersAuthorization,
  SReqPostLogin,
  SReqPostResetPassword,
  SResGetSession,
  SResPostLogin,
} from "shared/routes/auth.routes";
import { SResError } from "shared/routes/common.routes";

import config from "@/config";

import { createUserTokenSimple } from "../../utils/jwtUtils";
import {
  resetPassword,
  sendResetPasswordEmail,
  verifyEmailPassword,
} from "../actions/auth.actions";
import { createSession, deleteSession } from "../actions/sessions.actions";
import { Server } from ".";

export const authRoutes = ({ server }: { server: Server }) => {
  /**
   * Récupérer l'utilisateur connecté
   */
  server.get(
    "/auth/session",
    {
      schema: {
        response: { 200: SResGetSession },
        headers: SReqHeadersAuthorization,
      } as const,
      preHandler: server.auth([server.validateSession, server.validateJWT]),
    },
    async (request, response) => {
      return response.status(200).send(request.user);
    }
  );

  /**
   * Login
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

      const user = await verifyEmailPassword(email, password);

      if (!user || !user._id) {
        return response.status(401).send({
          type: "invalid_credentials",
          message: "Identifiants incorrects.",
        });
      }

      const token = createUserTokenSimple({ payload: { email: user.email } });
      await createSession({ token });

      return response
        .setCookie(config.session.cookieName, token, config.session.cookie)
        .status(200)
        .send(user as IResPostLogin);
    }
  );

  server.get("/auth/logout", {}, async (request, response) => {
    const token = request.cookies[config.session.cookieName];

    if (token) {
      await deleteSession({ token });

      return response
        .clearCookie(config.session.cookieName, config.session.cookie)
        .status(200)
        .send();
    }

    return response.status(200).send();
  });

  server.get(
    "/auth/reset-password",
    {
      schema: {
        querystring: SReqGetResetPassword,
      } as const,
    },
    async (request, response) => {
      await sendResetPasswordEmail(request.query.email);
      return response.status(200).send();
    }
  );

  server.post(
    "/auth/reset-password",
    {
      schema: {
        body: SReqPostResetPassword,
        response: {
          401: SResError,
        },
      } as const,
    },
    async (request, response) => {
      const { password, token } = request.body;

      try {
        await resetPassword(password, token);

        return response.status(200).send();
      } catch (error) {
        return response.status(401).send({
          type: "invalid_token",
          message: "Jeton invalide",
        });
      }
    }
  );
};
