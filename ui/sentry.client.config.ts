import * as Sentry from "@sentry/nextjs";

import { publicConfig } from "./config.public";

Sentry.init({
  dsn: publicConfig.sentry.dsn,
  tracesSampleRate: publicConfig.env === "production" ? 0.01 : 1.0,
  tracePropagationTargets: [
    /^https:\/\/[^/]*\.apprentissage\.beta\.gouv\.fr/,
    publicConfig.baseUrl,
    publicConfig.apiEndpoint,
    /^\//,
  ],
  environment: publicConfig.env,
  enabled: publicConfig.env !== "local",
  release: publicConfig.version,
  normalizeDepth: 8,
  // replaysOnErrorSampleRate: 1.0,
  // replaysSessionSampleRate: 0.1,
  integrations: [
    Sentry.extraErrorDataIntegration({ depth: 8 }),
    Sentry.httpClientIntegration({}),
    Sentry.reportingObserverIntegration({ types: ["crash", "deprecation", "intervention"] }),
  ],
});
