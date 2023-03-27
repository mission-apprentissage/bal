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

export type Server = typeof server;
