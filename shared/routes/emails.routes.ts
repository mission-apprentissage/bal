import { z } from "zod";

import { IRoutesDef } from "./common.routes";

export const zEmailParams = z.object({ token: z.string() }).strict();

export const zEmailRoutes = {
  get: {
    "/emails/:token/preview": {
      method: "get",
      path: "/emails/:token/preview",
      params: zEmailParams,
      response: {
        "200": z.unknown(),
      },
      securityScheme: null,
    },
    "/emails/:token/markAsOpened": {
      method: "get",
      path: "/emails/:token/markAsOpened",
      params: zEmailParams,
      response: {
        "200": z.unknown(),
      },
      securityScheme: null,
    },
    "/emails/:token/unsubscribe": {
      method: "get",
      path: "/emails/:token/unsubscribe",
      params: zEmailParams,
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
      querystring: z
        .object({
          webhookKey: z.string(),
        })
        .passthrough(),
      body: z
        .object({
          event: z.string(), //https://developers.sendinblue.com/docs/transactional-webhooks
          "message-id": z.string(),
        })
        .strict(),
      response: {
        "200": z.unknown(),
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;
