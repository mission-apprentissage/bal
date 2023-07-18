// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {
  ExtraErrorData,
  HttpClient,
  ReportingObserver,
} from "@sentry/integrations";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NEXT_PUBLIC_ENV === "production" ? 0.1 : 1.0,
  tracePropagationTargets: [/\.apprentissage\.beta\.gouv\.fr$/],
  environment: process.env.NEXT_PUBLIC_ENV,
  enabled: process.env.NEXT_PUBLIC_ENV !== "local",
  // debug: true,
  normalizeDepth: 8,
  // replaysOnErrorSampleRate: 1.0,
  // replaysSessionSampleRate: 0.1,
  integrations: [
    // new Sentry.Replay({
    //   maskAllText: true,
    //   blockAllMedia: true,
    // }),
    // @ts-ignore
    new ExtraErrorData({ depth: 8 }),
    // @ts-ignore
    new HttpClient({}),
    // @ts-ignore
    new ReportingObserver({ types: ["crash", "deprecation", "intervention"] }),
  ],
});
