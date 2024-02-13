import { z } from "zod";

export const zControlsRoutes = {
  get: {},
  post: {
    "/v1/controls/email": {
      body: z
        .object({
          email: z.string().email(),
        })
        .passthrough(),
      response: {
        "2xx": z.any(),
      },
    },
  },
  put: {},
  delete: {},
};
