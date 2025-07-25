import { nodeProfilingIntegration } from "@sentry/profiling-node";
import * as Sentry from "@sentry/node";

import config from "../../../config";

function getOptions(): Sentry.NodeOptions {
  return {
    tracesSampler: (samplingContext) => {
      // Continue trace decision, if there is any parentSampled information
      if (samplingContext.parentSampled != null) {
        return samplingContext.parentSampled;
      }

      if (samplingContext.attributes?.["sentry.op"] === "queue.task") {
        return 1 / 10_000;
      }

      if (samplingContext.attributes?.["sentry.op"] === "processor.job") {
        // Sample 100% of processor jobs
        return 1.0;
      }

      return 0.01;
    },
    tracePropagationTargets: [/^https:\/\/[^/]*\.apprentissage\.beta\.gouv\.fr/],
    profilesSampleRate: 0.001,
    environment: config.env,
    release: config.version,
    enabled: config.env !== "local",
    integrations: [
      Sentry.httpIntegration(),
      Sentry.mongoIntegration(),
      Sentry.captureConsoleIntegration({ levels: ["error"] }),
      Sentry.extraErrorDataIntegration({ depth: 16 }),
      nodeProfilingIntegration(),
    ],
  };
}

export function initSentry(): void {
  Sentry.init(getOptions());
}

export async function closeSentry(): Promise<void> {
  await Sentry.close(2_000);
}
