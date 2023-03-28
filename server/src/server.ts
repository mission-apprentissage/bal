import { FastifyAuthFunction } from "@fastify/auth";
import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";

import build from "./app";

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
