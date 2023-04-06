import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCors from "@fastify/cors";
import fastifySecureSession from "@fastify/secure-session";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify, { FastifyServerOptions } from "fastify";

import { config } from "../../../config/config";
import pJson from "../../../package.json";
import { authRoutes } from "./auth.routes";
import { coreRoutes } from "./core.routes";
import { userRoutes } from "./user.routes";
import { authValidateJWT, authValidateSession } from "./utils/auth.strategies";

type FastifyServer = typeof server;
export interface Server extends FastifyServer {
  validateJWT: FastifyAuthFunction;
  validateSession: FastifyAuthFunction;
}

export function build(opts: FastifyServerOptions = {}) {
  const app = fastify(opts);

  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Documentation BAL",
        version: pJson.version,
      },
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/api/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
  });

  app.register(fastifySecureSession, {
    secret: config.session.secret,
    salt: config.session.salt,
    cookie: {
      path: "/",
      httpOnly: true,
    },
  });

  // stratégies d'authentification
  app
    .decorate("validateJWT", authValidateJWT)
    .decorate("validateSession", authValidateSession);

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

export const registerRoutes = ({ server }: { server: Server }) => {
  coreRoutes({ server });
  userRoutes({ server });
  authRoutes({ server });
};
