import fastifyAuth, { FastifyAuthFunction } from "@fastify/auth";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify, { FastifyServerOptions } from "fastify";

import pJson from "../../../package.json";
import { coreRoutes } from "./core.routes";
import { userRoutes } from "./user.routes";

type FastifyServer = typeof server;
export interface Server extends FastifyServer {
  validateJWT: FastifyAuthFunction;
}

import { authValidateJWT } from "./utils/auth.strategies";

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

  app.decorate("validateJWT", authValidateJWT);

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
};
