import { config } from "dotenv";

config({ path: ".env", quiet: process.env.NODE_ENV === "test" });
config({ path: ".env.local", override: true, quiet: process.env.NODE_ENV === "test" });

// eslint-disable-next-line @typescript-eslint/no-floating-promises
import("./common/services/sentry/sentry")
  .then(async ({ initSentry }) => {
    initSentry();
  })
  .then(async () => {
    // Dynamic import to start server after env are loaded
    return import("./main.js");
  });
