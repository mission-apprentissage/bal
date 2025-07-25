import * as Sentry from "@sentry/node";
import type { FastifyRequest } from "fastify";
import type { Server } from "../../../modules/server/server";

type UserData = {
  id?: string | number;
  username: string;
  email?: string;
} & Record<string, unknown>;

function extractUserData(request: FastifyRequest): UserData {
  const user = request.user;

  if (!user) {
    // @ts-expect-error
    return {
      segment: "anonymous",
    };
  }

  if (user.type === "token") {
    const identity = user.value.identity;
    return {
      segment: "access-token",
      id: identity.email,
      email: identity.email,
      username: identity.email,
    };
  }

  const data: UserData = {
    segment: "session",
    id: user.value._id.toString(),
    username: user.value.email ?? user.value._id.toString(),
    type: user.value.is_admin ? "admin" : "standard",
  };

  if (user.value.email) {
    data.email = user.value.email;
  }

  return data;
}

export function initSentryFastify(app: Server) {
  app.addHook("onRequest", async (request, _reply) => {
    const scope = Sentry.getIsolationScope();
    scope
      .setUser(extractUserData(request))
      .setExtra("headers", request.headers)
      .setExtra("method", request.method)
      .setExtra("protocol", request.protocol)
      .setExtra("query_string", request.query);
  });
}
