import { z } from "zod";

export const zTcoRoutes = {
  get: {},
  post: {
    "/v1/cfdrncp": {
      body: z.object({
        cfd: z.string().regex(new RegExp("^[0-9A-Z]{8}[A-Z]?$")),
        rncp: z.string().regex(new RegExp("^(RNCP)?[0-9]{2,5}$")),
      }),
      response: {
        "2xx": z.object({}),
      },
    },
  },
  put: {},
  delete: {},
};
