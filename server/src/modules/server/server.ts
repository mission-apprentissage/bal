import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Boom from "@hapi/boom";
import fastify, {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import {
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import { IRouteSchema, WithSecurityScheme } from "shared/routes/common.routes";

import { initSentryFastify } from "../../common/services/sentry/sentry";
import config from "../../config";
import { organisationAdminRoutes } from "./admin/organisation.routes";
import { personAdminRoutes } from "./admin/person.routes";
import { uploadAdminRoutes } from "./admin/upload.routes";
import { userAdminRoutes } from "./admin/user.routes";
import { authRoutes } from "./auth.routes";
import { coreRoutes } from "./core.routes";
import { documentsRoutes } from "./documents.routes";
import { emailsRoutes } from "./emails.routes";
import { mailingListRoutes } from "./mailingList.routes";
import { auth } from "./middlewares/authMiddleware";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";
import { userRoutes } from "./user.routes";
import { organisationRoutes } from "./v1/organisation.routes";

export interface Server
  extends FastifyInstance<
    RawServerDefault,
    RawRequestDefaultExpression<RawServerDefault>,
    RawReplyDefaultExpression<RawServerDefault>,
    FastifyBaseLogger,
    ZodTypeProvider
  > {}

export async function bind(app: Server) {
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
  app.decorate("auth", <S extends IRouteSchema & WithSecurityScheme>(scheme: S) => auth(scheme));

  app.register(fastifyMultipart);
  app.register(fastifyCors, {
    ...(config.env === "local"
      ? {
          origin: true,
          credentials: true,
        }
      : {}),
  });

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

  app.setNotFoundHandler((req, res) => {
    res.status(404).send(Boom.notFound().output);
  });

  errorMiddleware(app);

  return app;
}

export default async (): Promise<Server> => {
  const app: Server = fastify({
    logger: logMiddleware(),
    trustProxy: 1,
    caseSensitive: false,
  }).withTypeProvider<ZodTypeProvider>();

  return bind(app);
};

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
  documentsRoutes({ server });
};

export const registerV1Routes: RegisterRoutes = ({ server }) => {
  organisationRoutes({ server });
};
