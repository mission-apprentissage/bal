import { z } from "zod";

import { ZDocumentContent } from "../models/documentContent.model";

export const zDocumentRoutes = {
  get: {
    "/documents/columns": {
      querystring: z
        .object({
          type: z.string(),
        })
        .strict(),
      response: {
        "2xx": z.array(z.string()),
      },
    },
    "/documents/types": {
      response: {
        "2xx": z.array(z.string()),
      },
    },
    "/documents/sample": {
      querystring: z
        .object({
          type: z.string(),
        })
        .strict(),
      response: {
        "2xx": z.array(ZDocumentContent),
      },
    },
  },
};
