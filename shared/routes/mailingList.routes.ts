import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZMailingList } from "../models/mailingList.model";
import { IRoutesDef } from "./common.routes";

export const zMailingListRoutes = {
  get: {
    "/mailing-lists": {
      method: "get",
      path: "/mailing-lists",
      response: {
        "200": z.array(ZMailingList),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/mailing-lists/:id": {
      method: "get",
      path: "/mailing-lists/:id",
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "200": ZMailingList,
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/mailing-lists/:id/download": {
      method: "get",
      path: "/mailing-lists/:id/download",
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "200": z.unknown(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/mailing-lists/:id/progress": {
      method: "get",
      path: "/mailing-lists/:id/progress",
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "200": z
          .object({
            status: z.enum(["pending", "will_start", "running", "finished", "blocked", "errored"]),
            processed: z.number(),
            processed_count: z.number(),
          })
          .strict(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  post: {
    "/mailing-list": {
      method: "post",
      path: "/mailing-list",
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
        "200": z.object({ success: z.literal(true) }).strict(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  delete: {
    "/mailing-list/:id": {
      method: "delete",
      path: "/mailing-list/:id",
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "200": z.object({ success: z.literal(true) }).strict(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
