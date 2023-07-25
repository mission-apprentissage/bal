import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZJob } from "../models/job.model";

export const zMailingListRoutes = {
  get: {
    "/mailing-lists": {
      response: {
        "2xx": z.array(ZJob),
      },
    },
    "/mailing-lists/:id": {
      params: z.object({ id: zObjectId }),
      response: {
        "2xx": ZJob,
      },
    },
    "/mailing-lists/:id/download": {
      params: z.object({ id: zObjectId }),
      response: {
        "2xx": z.unknown(),
      },
    },
  },
  post: {
    "/mailing-list": {
      body: z.object({ source: z.string() }).strict(),
      response: {
        "2xx": z.undefined(),
      },
    },
  },
  put: {},
  delete: {
    "/mailing-list/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": z.undefined(),
      },
    },
  },
};
