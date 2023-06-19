import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger, { JSONObject } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify, { FastifySchema, FastifyServerOptions } from "fastify";

import pJson from "../../../package.json";
import { organisationAdminRoutes } from "./admin/organisation.routes";
import { personAdminRoutes } from "./admin/person.routes";
import { uploadAdminRoutes } from "./admin/upload.routes";
import { userAdminRoutes } from "./admin/user.routes";
import { authRoutes } from "./auth.routes";
import { coreRoutes } from "./core.routes";
import { emailsRoutes } from "./emails.routes";
import { mailingListRoutes } from "./mailingList.routes";
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
      securityDefinitions: {
        apiKey: {
          type: "apiKey",
          name: "Authorization",
          in: "header",
        },
      },
    },
    transform: ({ schema, url }) => {
      const transformedSchema = { ...schema } as FastifySchema;
      if (!url.includes("/v1") && url !== "/api/healthcheck")
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

  app.setErrorHandler(function (error, request, reply) {
    // @ts-ignore
    if (error.isBoom) {
      // eslint-disable-next-line prefer-const
      let payload = { message: error.message, errors: [] };
      if (error.name === "ZodError") {
        payload.message = "Validation failed";
        // @ts-ignore
        payload.errors = error.errors;
      }
      // @ts-ignore
      return reply.status(error.output.statusCode).send(payload); // error.errors
    }

    // Send error response
    return reply.send({ message: error.message });
  });

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
  personAdminRoutes({ server });
  organisationAdminRoutes({ server });
  uploadAdminRoutes({ server });
  mailingListRoutes({ server });
};

export const registerV1Routes: RegisterRoutes = ({ server }) => {
  organisationRoutes({ server });
};
