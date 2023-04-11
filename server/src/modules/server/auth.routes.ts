import {
  SReqGetResetPassword,
  SReqPostLogin,
  SReqPostResetPassword,
  SResPostLogin,
} from "shared/routes/auth.routes";
import { SResError } from "shared/routes/common.routes";

import {
  resetPassword,
  sendResetPasswordEmail,
  verifyEmailPassword,
} from "../actions/auth.actions";
import { Server } from ".";

declare module "fastify" {
  interface Session {
    userId?: string | null;
  }
}

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

      const user = await verifyEmailPassword(email, password);

      if (!user || !user._id) {
        return response.status(401).send({
          type: "invalid_credentials",
          message: "Identifiants incorrects.",
        });
      }

      request.session.set("userId", user._id);

      return response.status(200).send(user);
    }
  );

  server.get("/auth/logout", {}, async (request, response) => {
    request.session.userId = null;
    await request.session.destroy();

    return response.status(200).send();
  });

  server.get(
    "/auth/reset-password",
    {
      schema: {
        querystring: SReqGetResetPassword,
        response: {
          401: SResError,
        },
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
