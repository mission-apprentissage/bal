import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { Boom, isBoom } from "@hapi/boom";
import { captureException } from "@sentry/node";
import fastify, {
  FastifyBaseLogger,
  FastifyError,
  FastifyInstance,
  FastifyServerOptions,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import {
  createJsonSchemaTransform,
  ResponseValidationError,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { IResError } from "shared/routes/common.routes";
import { ZodError } from "zod";

import logger from "../../common/logger";
import { initSentryFastify } from "../../common/services/sentry/sentry";
import config from "../../config";
import { uploadAdminRoutes } from "./admin/upload.routes";
import { userAdminRoutes } from "./admin/user.routes";
import { authRoutes } from "./auth.routes";
import { coreRoutes } from "./core.routes";
import { documentsRoutes } from "./documents.routes";
import { userRoutes } from "./user.routes";
import { authValidateJWT, authValidateSession, authWebHookKey } from "./utils/auth.strategies";
import { geoRoutes } from "./v1/geo.routes";
import { nafRoutes } from "./v1/naf.routes";
import { siretRoutes } from "./v1/siret.routes";

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
    ZodTypeProvider
  > {}

function getZodMessageError(error: ZodError, context: string): string {
  const normalizedContext = context ? `${context}.` : "";
  return error.issues.reduce((acc, issue, i) => {
    const path = issue.path.length === 0 ? "" : issue.path.join(".");
    const delimiter = i === 0 ? "" : ", ";
    return acc + `${delimiter}${normalizedContext}${path}: ${issue.message}`;
  }, "");
}

export function build(opts: FastifyServerOptions = {}): Server {
  const app = fastify(opts);
  initSentryFastify(app);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    swagger: {
      info: {
        title: "API documentation BAL",
        version: config.version,
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
    transform: createJsonSchemaTransform({
      skipList: ["/api/healthcheck", "/api/documentation"],
    }),
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
  app.register(fastifyCors, {
    ...(config.env === "local"
      ? {
          origin: true,
          credentials: true,
        }
      : {}),
  });

  app.setErrorHandler<FastifyError | Boom<unknown> | Error | ZodError, { Reply: IResError }>(
    (error, _request, reply) => {
      logger.error(error);

      let statusCode = (error as FastifyError).statusCode ?? 500;
      let message = config.env === "local" ? error.message : "Internal Server Error";
      let name = error.name;

      if (error.name === "ResponseValidationError") {
        name = "Response Validation failed";
        statusCode = 500;
        if (config.env === "local") {
          message = getZodMessageError((error as ResponseValidationError).details as ZodError, "response");
        }
      }
      if (error instanceof ZodError) {
        name = "Validation failed";
        message = getZodMessageError(error, (error as unknown as FastifyError).validationContext ?? "");
      }

      if (isBoom(error)) {
        statusCode = error.output.statusCode;

        return reply.status(statusCode).send({
          message: statusCode >= 500 && config.env !== "local" ? "Internal Server Error" : message,
          statusCode,
          name,
        });
      }

      if (statusCode >= 500) {
        captureException(error);
      }

      return reply.status(statusCode).send({
        message,
        statusCode,
        name,
      });
    }
  );

  app.register(
    async (instance: Server) => {
      registerRoutes({ server: instance });
    },
    { prefix: "/api" }
  );
  app.register(
    async (instance: Server) => {
      registerV1Routes({ server: instance });
    },
    { prefix: "/api/v1" }
  );

  return app.withTypeProvider<ZodTypeProvider>();
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
});

type RegisterRoutes = (opts: { server: Server }) => void;

export const registerRoutes: RegisterRoutes = ({ server }) => {
  coreRoutes({ server });
  authRoutes({ server });
  userRoutes({ server });
  userAdminRoutes({ server });
  uploadAdminRoutes({ server });
  documentsRoutes({ server });
};

export const registerV1Routes: RegisterRoutes = ({ server }) => {
  siretRoutes({ server });
  geoRoutes({ server });
  nafRoutes({ server });
};
