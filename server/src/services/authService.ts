import { FastifyAuthFunction } from "@fastify/auth";

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
