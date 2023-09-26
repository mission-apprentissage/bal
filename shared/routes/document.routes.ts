import { z } from "zod";

export const zDocumentRoutes = {
  get: {
    "/documents/types": {
      response: {
        "2xx": z.array(z.string()),
      },
    },
  },
};
