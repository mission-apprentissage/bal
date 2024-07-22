import { z } from "../helpers/zodWithOpenApi";
import { IRoutesDef } from "./common.routes";

export const zCoreRoutes = {
  get: {
    "/healthcheck": {
      method: "get",
      path: "/healthcheck",
      response: {
        "200": z
          .object({
            name: z.string().openapi({
              example: "bal",
            }),
            version: z.string().openapi({
              example: "1.0.0",
            }),
            env: z.enum(["local", "recette", "production", "preview", "test"]),
          })
          .describe("API Health")
          ,
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
