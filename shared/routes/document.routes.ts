import { z } from "zod";

export const zDocumentRoutes = {
  get: {
    "/documents/columns": {
      querystring: z.object({
        type: z.string(),
      }),
      response: {
        "2xx": z.array(z.string()),
      },
    },
    "/documents/types": {
      response: {
        "2xx": z.array(z.string()),
      },
    },
  },
};
