import fastifySentryPlugin, { FastifySentryOptions } from "@immobiliarelabs/fastify-sentry";
import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";
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
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Mongo({ useMongoose: false }),
      new CaptureConsole({ levels: ["error"] }),
      new ExtraErrorData({ depth: 8 }),
    ],
  };
}

export function initSentryProcessor(): void {
  Sentry.init(getOptions());
}

export async function closeSentry(): Promise<void> {
  await Sentry.close(2_000);
}

function extractUserData(request: FastifyRequest): {
  id?: string | number;
  username: string;
  email?: string;
} & Record<string, unknown> {
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

  return {
    segment: "session",
    id: user.value._id.toString(),
    email: user.value.email,
    username: user.value.email,
    type: user.value.is_admin ? "admin" : "standard",
  };
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

function getTransation() {
  return Sentry.getCurrentHub()?.getScope()?.getSpan();
}

export function startSentryPerfRecording(
  category: string,
  operation: string,
  data: {
    [key: string]: unknown;
  } = {}
): () => void {
  const childTransaction =
    getTransation()?.startChild({
      op: category,
      description: operation,
      data,
    }) ?? null;

  return () => {
    childTransaction?.finish();
  };
}
