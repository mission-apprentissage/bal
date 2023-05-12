import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger, { JSONObject } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify, { FastifySchema, FastifyServerOptions } from "fastify";

import pJson from "../../../package.json";
import { uploadAdminRoutes } from "./admin/upload.routes";
import { userAdminRoutes } from "./admin/user.routes";
import { authRoutes } from "./auth.routes";
import { coreRoutes } from "./core.routes";
import { emailsRoutes } from "./emails.routes";
import { userRoutes } from "./user.routes";
import {
  authValidateJWT,
  authValidateSession,
  authWebHookKey,
} from "./utils/auth.strategies";
import { organisationRoutes } from "./v1/organisation.routes";

type FastifyServer = typeof server;
export interface Server extends FastifyServer {
  validateJWT: FastifyAuthFunction;
  validateSession: FastifyAuthFunction;
  validateWebHookKey: FastifyAuthFunction;
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
      if (
        url.startsWith("/api/auth") ||
        url.startsWith("/api/emails") ||
        url.startsWith("/api/user") ||
        url.startsWith("/api/admin")
      )
        transformedSchema.hide = true;
      return { schema: transformedSchema as JSONObject, url };
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

  // stratégies d'authentification
  app
    .decorate("validateJWT", authValidateJWT)
    .decorate("validateSession", authValidateSession)
    .decorate("validateWebHookKey", authWebHookKey);

  app.register(fastifyMultipart);
  app.register(fastifyAuth);
  app.register(fastifyCors, {});
  app.register(
    async (instance) => {
      registerRoutes({ server: instance as Server });
    },
    { prefix: "/api" }
  );
  app.register(
    async (instance) => {
      registerV1Routes({ server: instance as Server });
    },
    { prefix: "/api/v1" }
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

type RegisterRoutes = (opts: { server: Server }) => void;

export const registerRoutes: RegisterRoutes = ({ server }) => {
  coreRoutes({ server });
  authRoutes({ server });
  userRoutes({ server });
  emailsRoutes({ server });
  userAdminRoutes({ server });
  uploadAdminRoutes({ server });
};

export const registerV1Routes: RegisterRoutes = ({ server }) => {
  organisationRoutes({ server });
};
