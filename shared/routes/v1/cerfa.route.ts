import { z } from "zod";

export const zCerfaRoutes = {
  get: {},
  post: {
    "/v1/cerfa": {
      body: z.object({
        values: z.record(z.any()),
        errors: z.record(z.any()),
        output: z
          .object({
            include_errors: z.boolean().optional(),
            include_guide: z.boolean().optional(),
          })
          .optional(),
      }),
      response: {
        "2xx": z.any(),
      },
    },
  },
  put: {},
  delete: {},
};
