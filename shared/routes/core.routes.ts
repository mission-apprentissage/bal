import { z } from "zod/v4-mini";
import type { IRoutesDef } from "./common.routes";

export const zCoreRoutes = {
  get: {
    "/healthcheck": {
      method: "get",
      path: "/healthcheck",
      response: {
        "200": z.object({
          name: z.string(),
          version: z.string(),
          env: z.enum(["local", "recette", "production", "preview", "test"]),
        }),
      },
      securityScheme: null,
      openapi: {
        tags: ["système"] as string[],
      },
    },
    "/healthcheck/sentry": {
      method: "get",
      path: "/healthcheck/sentry",
      response: {
        "200": z.never(),
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;
