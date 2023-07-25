import { z } from "zod";

export const zEmailParams = z.object({ token: z.string() }).strict();

export const zEmailRoutes = {
  get: {
    "/emails/:token/preview": {
      params: zEmailParams,
      response: {
        "2xx": z.unknown(),
      },
    },
    "/emails/:token/markAsOpened": {
      params: zEmailParams,
      response: {
        "2xx": z.unknown(),
      },
    },
    "/emails/:token/unsubscribe": {
      params: zEmailParams,
      response: {
        "2xx": z.unknown(),
      },
    },
  },
  post: {
    "/emails/webhook": {
      body: z
        .object({
          event: z.string(), //https://developers.sendinblue.com/docs/transactional-webhooks
          "message-id": z.string(),
        })
        .strict(),
      response: {
        "2xx": z.unknown(),
      },
    },
  },
  put: {},
  delete: {},
};
