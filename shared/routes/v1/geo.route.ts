import { z } from "zod";

export const zGeoRoutes = {
  get: {},
  post: {
    "/v1/geo/cp": {
      body: z.object({
        codePostal: z.string().regex(new RegExp("^[0-9]{5}$")),
      }),
      response: {
        "2xx": z.object({}),
      },
    },
  },
  put: {},
  delete: {},
};
