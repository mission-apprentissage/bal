import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifySession from "@fastify/session";
import fastifySwagger, { JSONObject } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify, { FastifySchema, FastifyServerOptions } from "fastify";

import { config } from "../../../config/config";
import pJson from "../../../package.json";
import { authRoutes } from "./auth.routes";
import { coreRoutes } from "./core.routes";
import { organisationRoutes } from "./organisation.routes";
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
        title: "API documentation BAL",
        version: pJson.version,
      },
      consumes: ["application/json"],
      produces: ["application/json"],
    },
    transform: ({ schema, url }) => {
      const transformedSchema = { ...schema } as FastifySchema;
      if (url.startsWith('/api/auth') || url.startsWith('/api/user')) transformedSchema.hide = true;
      return { schema: transformedSchema as JSONObject,url }
    },
  });

  app.register(fastifySwaggerUi, {
    routePrefix: "/api/documentation",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  app.register(fastifyCookie);
  app.register(fastifySession, {
    secret: config.session.secret,
    cookieName: config.session.cookieName,
    cookie: config.session.cookie,
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
  organisationRoutes({ server });
};
