import f from "@immobiliarelabs/fastify-sentry";
import { CaptureConsole, ExtraErrorData } from "@sentry/integrations";
import * as Sentry from "@sentry/node";
import { IUser } from "shared/models/user.model";

import config from "../../../config";

function getOptions() {
  return {
    tracesSampleRate: config.env === "production" ? 0.1 : 1.0,
    tracePropagationTargets: [/\.apprentissage\.beta\.gouv\.fr$/],
    environment: config.env,
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

function getUserSegment(user: IUser | void | null) {
  if (!user) {
    return "anonymous";
  }

  return user.is_admin ? "admin" : "user";
}

export function initSentryFastify(app) {
  app.register(f, {
    setErrorHandler: false,
    extractUserData: (request) => {
      return {
        id: request.user?._id.toString(),
        email: request.user?.email,
        segment: getUserSegment(request.user),
      };
    },
    extractRequestData: (request) => {
      return {
        headers: request.headers,
        method: request.method,
        protocol: request.protocol,
        query_string: request.query_string,
      };
    },
    ...getOptions(),
  });
}
