import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger, { JSONObject } from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import { Boom, isBoom } from "@hapi/boom";
import { captureException } from "@sentry/node";
import fastify, {
  FastifyBaseLogger,
  FastifyError,
  FastifyInstance,
  FastifySchema,
  FastifyServerOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { IResError } from "shared/routes/common.routes";
import { ZodError } from "zod";

import pJson from "../../../package.json";
import logger from "../../common/logger";
import { initSentryFastify } from "../../common/services/sentry/sentry";
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

declare module "fastify" {
  interface FastifyInstance {
    validateJWT: FastifyAuthFunction;
    validateSession: FastifyAuthFunction;
    validateWebHookKey: FastifyAuthFunction;
  }
}

export interface Server
  extends FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    JsonSchemaToTsProvider
  > {}

export function build(opts: FastifyServerOptions = {}): Server {
  const app = fastify(opts);
  initSentryFastify(app);

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

  app.setErrorHandler<
    FastifyError | Boom<unknown> | Error | ZodError,
    { Reply: IResError }
  >((error, _request, reply) => {
    logger.error(error);

    let statusCode = (error as FastifyError).statusCode ?? 500;
    let message = error.message;
    let name = error.name;

    if (error instanceof ZodError) {
      name = "Validation failed";
      message = error.issues.reduce((acc, issue, i) => {
        const path = issue.path.length === 0 ? "" : issue.path.join(".");
        const delimiter = i === 0 ? "" : ", ";
        return acc + `${delimiter}${path}: ${issue.message}`;
      }, "");
    }

    if (isBoom(error)) {
      statusCode = error.output.statusCode;

      return reply.status(statusCode).send({
        message,
        statusCode,
        name,
      });
    }

    if (statusCode >= 500) {
      captureException(error);
    }

    return reply.status(statusCode).send({
      message: error.message,
      statusCode,
      name,
    });
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
  trustProxy: 1,
}).withTypeProvider<JsonSchemaToTsProvider>() as Server;

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
