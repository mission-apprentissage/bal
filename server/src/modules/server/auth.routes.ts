import Boom from "@hapi/boom";
import {
  IReqGetResetPassword,
  IReqPostLogin,
  IReqPostResetPassword,
  IResPostLogin,
  SReqGetResetPassword,
  SReqPostLogin,
  SReqPostResetPassword,
  SResGetSession,
  SResPostLogin,
} from "shared/routes/auth.routes";
import {
  IResError,
  SReqHeadersAuthorization,
  SResError,
} from "shared/routes/common.routes";

import config from "@/config";

import { createUserTokenSimple } from "../../common/utils/jwtUtils";
import {
  resetPassword,
  sendResetPasswordEmail,
  verifyEmailPassword,
} from "../actions/auth.actions";
import { createSession, deleteSession } from "../actions/sessions.actions";
import { Server } from "./server";

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
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      return response.status(200).send(request.user);
    }
  );

  /**
   * Login
   */
  server.post<{
    Body: IReqPostLogin;
    Reply: {
      200: IResPostLogin;
      403: IResError;
    };
  }>(
    "/auth/login",
    {
      schema: {
        body: SReqPostLogin,
        response: {
          200: SResPostLogin,
          403: SResError,
        },
      } as const,
    },
    async (request, response) => {
      const { email, password } = request.body;

      const user = await verifyEmailPassword(email, password);

      if (!user || !user._id) {
        throw Boom.forbidden("Identifiants incorrects");
      }

      const token = createUserTokenSimple({ payload: { email: user.email } });
      await createSession({ token });

      return (
        response
          .setCookie(config.session.cookieName, token, config.session.cookie)
          .status(200)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .send(user as any)
      ); // Fixme type, looks like we're returning too much info here!
    }
  );

  server.get("/auth/logout", {}, async (request, response) => {
    const token = request.cookies[config.session.cookieName];

    if (token) {
      await deleteSession(token);

      return response
        .clearCookie(config.session.cookieName, config.session.cookie)
        .status(200)
        .send();
    }

    return response.status(200).send();
  });

  server.get<{
    Querystring: IReqGetResetPassword;
  }>(
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

  server.post<{
    Body: IReqPostResetPassword;
  }>(
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
        throw Boom.badData("Jeton invalide");
      }
    }
  );
};
