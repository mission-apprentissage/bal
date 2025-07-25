import { z } from "zod/v4-mini";
import type { IRoutesDef } from "../common.routes";

export const zBrevoWebhooks = {
  post: {
    "/v1/webhooks/brevo/hardbounce": {
      method: "post",
      path: "/v1/webhooks/brevo/hardbounce",
      querystring: z.object({
        apiKey: z.string(),
      }),
      body: z.object({
        event: z.string(),
        email: z.string(),
        id: z.number(),
        ts: z.number(),
        date: z.nullish(z.string()),
        "message-id": z.nullish(z.string()),
        ts_event: z.nullish(z.number()),
        subject: z.nullish(z.string()),
        "X-Mailin-custom": z.nullish(z.string()),
        sending_ip: z.nullish(z.string()),
        ts_epoch: z.nullish(z.number()),
        template_id: z.nullish(z.number()),
        tag: z.nullish(z.string()),
        tags: z.nullish(z.array(z.string())),
        link: z.nullish(z.string()),
        reason: z.nullish(z.string()),
        date_sent: z.nullish(z.string()),
        date_event: z.nullish(z.string()),
        ts_sent: z.nullish(z.number()),
        camp_id: z.nullish(z.number()),
        campaign_name: z.nullish(z.string()),
        URL: z.nullish(z.string()),
        list_id: z.nullish(z.array(z.number())),
        sender_email: z.nullish(z.string()),
        is_returnpath: z.nullish(z.boolean()),
        key: z.nullish(z.string()),
        content: z.nullish(z.array(z.string())),
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
