import { config } from "dotenv"

config({ path: ".env", quiet: process.env.NODE_ENV === "test" })
config({ path: ".env.local", override: true, quiet: process.env.NODE_ENV === "test" })

void import("./common/services/sentry/sentry")
  .then(async ({ initSentry }) => {
    initSentry()
  })
  .then(async () => {
    // Dynamic import to start server after env are loaded
    return import("./main.js")
  })
  .catch((err) => {
    // Sentry n'est pas garanti initialisé ici, et le logger chargerait la config
    // avant que dotenv n'ait fini : on se rabat sur la sortie standard.
    console.error("bootstrap error", err)
    process.exit(1)
  })
