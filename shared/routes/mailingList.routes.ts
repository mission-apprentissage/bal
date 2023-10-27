import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZMailingList } from "../models/mailingList.model";

export const zMailingListRoutes = {
  get: {
    "/mailing-lists": {
      response: {
        "2xx": z.array(ZMailingList),
      },
    },
    "/mailing-lists/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": ZMailingList,
      },
    },
    "/mailing-lists/:id/download": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": z.unknown(),
      },
    },
    "/mailing-lists/:id/progress": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": z
          .object({
            status: z.enum(["pending", "will_start", "running", "finished", "blocked", "errored"]),
            processed: z.number(),
            processed_count: z.number(),
          })
          .strict(),
      },
    },
  },
  post: {
    "/mailing-list": {
      body: z
        .object({
          source: z.string(),
          campaign_name: z.string(),
          email: z.string(),
          secondary_email: z.string().optional(),
          identifier_columns: z.array(z.string()),
          output_columns: z.array(
            z
              .object({
                column: z.string(),
                output: z.string(),
                grouped: z.boolean(),
              })
              .strict()
          ),
        })
        .strict(),
      response: {
        "2xx": z.object({ success: z.literal(true) }).strict(),
      },
    },
  },
  put: {},
  delete: {
    "/mailing-list/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": z.object({ success: z.literal(true) }).strict(),
      },
    },
  },
};
