import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify from "fastify";

export const server = fastify({
  logger: true,
  ajv: {
    customOptions: {
      strict: "log",
      keywords: ["kind", "modifier"],
    },
  },
}).withTypeProvider<JsonSchemaToTsProvider>();

export type Server = typeof server;
