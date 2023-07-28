import Boom from "@hapi/boom";
import { FastifyRequest } from "fastify";

export async function ensureUserIsAdmin(request: FastifyRequest) {
  const { user } = request;

  if (!user?.is_admin) {
    throw Boom.forbidden();
  }
}
