import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zCoreRoutes = {
  get: {
    "/healthcheck": {
      method: "get",
      path: "/healthcheck",
      response: {
        "200": z
          .object({
            name: z.string(),
            version: z.string(),
            env: z.enum(["local", "recette", "production", "preview", "test"]),
          })
          .describe("API Health")
          .strict(),
      },
      securityScheme: null,
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
