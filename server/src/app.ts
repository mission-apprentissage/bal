import fastifyCors from "@fastify/cors";
import fastify, { FastifyServerOptions } from "fastify";

import { registerCoreModule } from "./modules/core";

export default function build(opts: FastifyServerOptions = {}) {
  const app = fastify(opts);

  app.register(fastifyCors, {});
  app.register(
    async (instance) => {
      registerCoreModule({ server: instance });
    },
    { prefix: "/api" }
  );

  return app;
}
