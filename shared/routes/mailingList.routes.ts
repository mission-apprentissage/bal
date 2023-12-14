import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZMailingListDocument } from "../models/document.model";
import { ZMailingList, ZMailingListWithDocument } from "../models/mailingList.model";
import { IRoutesDef } from "./common.routes";

export const zMailingListRoutes = {
  get: {
    "/mailing-lists": {
      method: "get",
      path: "/mailing-lists",
      response: {
        "200": z.array(ZMailingListWithDocument.passthrough()), // TODO to fix @moroine    "message": "Unrecognized key(s) in object: 'import_progress'"
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
            status: ZMailingListDocument.shape.job_status,
            process_progress: z.number(),
            lines_count: z.number(),
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
      body: ZMailingList.pick({
        source: true,
        campaign_name: true,
        email: true,
        secondary_email: true,
        identifier_columns: true,
        output_columns: true,
        training_columns: true,
      }).strict(),
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
