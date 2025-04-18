import { z } from "../../helpers/zodWithOpenApi";
import { IRoutesDef } from "../common.routes";

export const zBrevoWebhooks = {
  post: {
    "/v1/webhooks/brevo/hardbounce": {
      method: "post",
      path: "/v1/webhooks/brevo/hardbounce",
      querystring: z
        .object({
          apiKey: z.string(),
        })
        .strict(),
      body: z.object({
        event: z.string(),
        email: z.string(),
        id: z.number(),
        ts: z.number(),
        date: z.string().nullish(),
        "message-id": z.string().nullish(),
        ts_event: z.number().nullish(),
        subject: z.string().nullish(),
        "X-Mailin-custom": z.string().nullish(),
        sending_ip: z.string().nullish(),
        ts_epoch: z.number().nullish(),
        template_id: z.number().nullish(),
        tag: z.string().nullish(),
        tags: z.array(z.string()).nullish(),
        link: z.string().nullish(),
        reason: z.string().nullish(),
        date_sent: z.string().nullish(),
        date_event: z.string().nullish(),
        ts_sent: z.number().nullish(),
        camp_id: z.number().nullish(),
        campaign_name: z.string().nullish(),
        URL: z.string().nullish(),
        list_id: z.array(z.number()).nullish(),
        sender_email: z.string().nullish(),
        is_returnpath: z.boolean().nullish(),
        key: z.string().nullish(),
        content: z.array(z.string()).nullish(),
      }),
      response: {
        "204": z.unknown(),
      },
      securityScheme: {
        auth: "brevo-api-key",
        ressources: {},
        access: null,
      },
    },
  },
} as const satisfies IRoutesDef;
