import { captureException } from "@sentry/node";

export function withCause<T extends Error>(error: T, cause: Error, level: "fatal" | "error" | "warning" = "error"): T {
  error.cause = cause;
  captureException(cause, { level });
  return error;
}
