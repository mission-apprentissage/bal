import { z } from "zod";

export const zNafRoutes = {
  get: {},
  post: {
    "/v1/naf": {
      body: z.object({
        naf: z.string().regex(new RegExp("^.{1,6}$")),
      }),
      response: {
        "2xx": z.any(),
      },
    },
  },
  put: {},
  delete: {},
};
