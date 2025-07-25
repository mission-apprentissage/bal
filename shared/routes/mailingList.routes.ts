import { z } from "zod/v4-mini";

import { zObjectId } from "../models/common";
import { ZMailingListDocument } from "../models/document.model";
import { ZMailingList, ZMailingListWithDocumenAndOwner } from "../models/mailingList.model";
import type { IRoutesDef } from "./common.routes";

export const zMailingListRoutes = {
  get: {
    "/mailing-lists": {
      method: "get",
      path: "/mailing-lists",
      response: {
        "200": z.array(ZMailingListWithDocumenAndOwner),
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
      params: z.object({ id: zObjectId }),
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
      params: z.object({ id: zObjectId }),
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
      params: z.object({ id: zObjectId }),
      response: {
        "200": z.object({
          status: ZMailingListDocument.shape.job_status,
          process_progress: z.number(),
          lines_count: z.number(),
        }),
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
      body: z.pick(ZMailingList, {
        source: true,
        campaign_name: true,
        email: true,
        secondary_email: true,
        identifier_columns: true,
        output_columns: true,
        training_columns: true,
      }),
      response: {
        "200": z.object({ success: z.literal(true) }),
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
      params: z.object({ id: zObjectId }),
      response: {
        "200": z.object({ success: z.literal(true) }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  put: {
    "/mailing-list/:id/resume": {
      method: "put",
      path: "/mailing-list/:id/resume",
      params: z.object({ id: zObjectId }),
      response: {
        "200": z.object({ success: z.literal(true) }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
