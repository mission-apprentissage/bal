import { z } from "zod";

export const zCoreRoutes = {
  get: {
    "/healthcheck": {
      response: {
        "2xx": z
          .object({
            name: z.string(),
            version: z.string(),
            env: z.enum(["local", "recette", "production", "preview", "test"]),
          })
          .describe("API Health")
          .strict(),
      },
    },
    "/healthcheck/sentry": {
      response: {
        "2xx": z.never(),
      },
    },
  },
  post: {},
  put: {},
  delete: {},
};
