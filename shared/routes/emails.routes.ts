import { z } from "zod/v4-mini";

import { zObjectId } from "../models/common";
import type { IRoutesDef } from "./common.routes";

export const zEmailRoutes = {
  get: {
    "/emails/preview": {
      method: "get",
      path: "/emails/preview",
      querystring: z.object({
        data: z.string(),
      }),
      response: {
        "200": z.unknown(),
      },
      securityScheme: null,
    },
    "/emails/:id/markAsOpened": {
      method: "get",
      path: "/emails/:id/markAsOpened",
      params: z.object({ id: zObjectId }),
      response: {
        "200": z.unknown(),
      },
      securityScheme: {
        auth: "access-token",
        access: null,
        ressources: {
          events: [{ _id: { type: "params", key: "id" } }],
        },
      },
    },
    "/emails/unsubscribe": {
      method: "get",
      path: "/emails/unsubscribe",
      querystring: z.object({
        data: z.string(),
      }),
      response: {
        "200": z.unknown(),
      },
      securityScheme: null,
    },
  },
  post: {
    "/emails/webhook": {
      method: "post",
      path: "/emails/webhook",
      querystring: z.looseObject({
        webhookKey: z.string(),
      }),
      body: z.object({
        event: z.string(), //https://developers.sendinblue.com/docs/transactional-webhooks
        "message-id": z.string(),
      }),
      response: {
        "200": z.unknown(),
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;
