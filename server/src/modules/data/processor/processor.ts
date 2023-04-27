import { JsonSchemaToTsProvider } from "@fastify/type-provider-json-schema-to-ts";
import fastify, { FastifyServerOptions } from "fastify";

import logger from "../../../utils/logger";
import { documentRoutes } from "./document/document.routes";

export type FastifyServer = typeof server;

export function build(opts: FastifyServerOptions = {}) {
  const app = fastify(opts);

  app.register(
    async (instance) => {
      registerRoutes({ server: instance as FastifyServer });
    },
    { prefix: "/" }
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

type RegisterRoutes = (opts: { server: FastifyServer }) => void;

export const registerRoutes: RegisterRoutes = ({ server }) => {
  documentRoutes({ server });
};

export const processor = async () => {
  try {
    logger.info("Processor start");

    server.listen({ port: 6000, host: "0.0.0.0" }, function (err) {
      if (err) {
        console.log(err);
        process.exit(1);
      }
    });
  } catch (err) {
    process.exit(1);
  }
};
