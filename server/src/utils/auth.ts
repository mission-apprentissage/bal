import { FastifyAuthFunction } from "@fastify/auth";
import { createSigner } from "fast-jwt";

import { config } from "../../config/config";

interface IJwtPayload {
  [key: string]: unknown;
}

export const standAloneJWTSign = (payload: IJwtPayload) => {
  const signer = createSigner({ key: config.auth.jwtSigningKey });

  return signer(payload);
};

export const authValidateJWT: FastifyAuthFunction = (request, reply, done) => {
  const jwt = request.server.jwt;

  if (!request.raw.headers.auth) {
    return done(new Error("Jeton manquant"));
  }

  jwt.verify(request.raw.headers.auth as string, (error) => {
    if (error) {
      return done(new Error("Jeton invalide"));
    }
    done();
  });
};
