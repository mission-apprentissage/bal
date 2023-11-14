import { z } from "zod";

export const zCerfaRoutes = {
  get: {},
  post: {
    "/v1/cerfa": {
      body: z.any(),
      response: {
        "2xx": z.any(),
      },
    },
  },
  put: {},
  delete: {},
};
