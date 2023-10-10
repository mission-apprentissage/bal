import { z } from "zod";

export const zSiretRoutes = {
  get: {},
  post: {
    "/v1/siret": {
      body: z.object({
        siret: z.string(),
        organismeFormation: z.boolean(),
      }),
      response: {
        "2xx": z.object({}),
      },
    },
  },
  put: {},
  delete: {},
};
