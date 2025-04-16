import { extensions } from "../../helpers/zodHelpers/zodPrimitives";
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
      body: extensions.brevoWebhook,
      response: {
        "200": z.object({}).strict(),
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;
