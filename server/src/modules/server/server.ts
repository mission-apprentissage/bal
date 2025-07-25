import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import { fastifyMultipart } from "@fastify/multipart";
import type { FastifyStaticSwaggerOptions, StaticDocumentSpec } from "@fastify/swagger";
import { fastifySwagger } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import Boom from "@hapi/boom";
import type {
  FastifyBaseLogger,
  FastifyInstance,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from "fastify";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { buildOpenApiSchema } from "shared/helpers/openapi/openapi.builder";
import type { IRouteSchema, WithSecurityScheme } from "shared/routes/common.routes";

import config from "../../config";
import { initSentryFastify } from "../../common/services/sentry/sentry.fastify";
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
import { uploadSupportRoutes } from "./upload.support.routes";
import { userRoutes } from "./user.routes";
import { bouncerRoutes } from "./v1/bouncer.routes";
import { decaRoutes } from "./v1/deca.routes";
import { organisationRoutes } from "./v1/organisation.routes";
import { webhookRoutes } from "./webhooks.routes";

export type Server = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  FastifyBaseLogger,
  ZodTypeProvider
>;

export async function bind(app: Server) {
  initSentryFastify(app);

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  const swaggerOpts: FastifyStaticSwaggerOptions = {
    mode: "static",
    specification: {
      document: buildOpenApiSchema(
        config.version,
        config.env,
        config.env === "local" ? "http://localhost:5001/api" : `${config.publicUrl}/api`
      ) as StaticDocumentSpec["document"],
    },
  };
  await app.register(fastifySwagger, swaggerOpts);

  const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: "/api/documentation",
    uiConfig: {
      displayOperationId: true,
      operationsSorter: "method",
      tagsSorter: "alpha",
      docExpansion: "none",
      filter: true,
      deepLinking: true,
    },
  };
  await app.register(fastifySwaggerUi, swaggerUiOptions);

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
    { prefix: "/api" }
  );

  app.setNotFoundHandler((_req, res) => {
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
  uploadSupportRoutes({ server });
};

export const registerV1Routes: RegisterRoutes = ({ server }) => {
  organisationRoutes({ server });
  decaRoutes({ server });
  webhookRoutes({ server });
  bouncerRoutes({ server });
};
