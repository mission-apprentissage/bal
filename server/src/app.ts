import fastifyAuth from "@fastify/auth";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastify, { FastifyServerOptions } from "fastify";

import { config } from "../config/config";
import { registerCoreModule } from "./modules/core";
import { Server } from "./server";
import { authValidateJWT } from "./utils/auth";

export default function build(opts: FastifyServerOptions = {}) {
  const app = fastify(opts);

  app.decorate("validateJWT", authValidateJWT);

  app.register(fastifyJwt, {
    secret: config.auth.jwtSigningKey,
  });
  app.register(fastifyAuth);
  app.register(fastifyCors, {});
  app.register(
    async (instance) => {
      registerCoreModule({ server: instance as Server });
    },
    { prefix: "/api" }
  );

  return app;
}
