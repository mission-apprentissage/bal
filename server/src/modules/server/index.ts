import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify, { FastifyServerOptions } from "fastify";

import { config } from "../../../config/config";
import { coreRoutes } from "./core.routes";
import { userRoutes } from "./user.routes";
import { authValidateJWT } from "./utils/auth.strategies";

export function build(opts: FastifyServerOptions = {}) {
  const app = fastify(opts);

  app.decorate("validateJWT", authValidateJWT);

  app.register(fastifyJwt, {
    secret: config.auth.jwtSigningKey,
  });
  app.register(fastifyAuth);
  app.register(fastifyCors, {});
  app.register(
    async (instance) => {
      registerRoutes({ server: instance as Server });
    },
    { prefix: "/api" }
  );

  return app;
}


export const server = build({
  logger: true,
  ajv: {
    customOptions: {
      strict: "log",
      keywords: ["kind", "modifier"],
    },
  },
}).withTypeProvider<JsonSchemaToTsProvider>();

type FastifyServer = typeof server;

export interface Server extends FastifyServer {
  validateJWT: FastifyAuthFunction;
}


export const registerRoutes = ({ server }: { server: Server }) => {
  coreRoutes({ server });
  userRoutes({ server });
};

