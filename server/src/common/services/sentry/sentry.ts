import fastifySentryPlugin, { FastifySentryOptions } from "@immobiliarelabs/fastify-sentry";
import * as Sentry from "@sentry/node";
import { FastifyRequest } from "fastify";

import config from "../../../config";
import { Server } from "../../../modules/server/server";

function getOptions(): Sentry.NodeOptions {
  return {
    tracesSampleRate: config.env === "production" ? 0.1 : 1.0,
    tracePropagationTargets: [/^https:\/\/[^/]*\.apprentissage\.beta\.gouv\.fr/],
    environment: config.env,
    release: config.version,
    enabled: config.env !== "local",
    integrations: [
      Sentry.httpIntegration({}),
      Sentry.mongoIntegration(),
      Sentry.captureConsoleIntegration({ levels: ["error"] }),
      Sentry.extraErrorDataIntegration({ depth: 16 }),
    ],
  };
}

export function initSentryProcessor(): void {
  Sentry.init(getOptions());
}

export async function closeSentry(): Promise<void> {
  await Sentry.close(2_000);
}

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
  const options: FastifySentryOptions = {
    setErrorHandler: false,
    extractUserData: extractUserData,
    extractRequestData: (request: FastifyRequest) => {
      return {
        headers: request.headers,
        method: request.method,
        protocol: request.protocol,
        query_string: request.query,
      };
    },
  };

  // @ts-expect-error
  app.register(fastifySentryPlugin, { options, ...getOptions() });
}
