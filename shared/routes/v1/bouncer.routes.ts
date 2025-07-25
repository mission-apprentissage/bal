import { z } from "zod/v4-mini";
import type { IRoutesDef } from "../common.routes";
import { ZReqHeadersAuthorization } from "../common.routes";

const zEmailResult = z.object({
  email: z.email(),
  status: z.enum(["valid", "invalid", "unknown", "queued"]),
});

export type IEmailResult = z.output<typeof zEmailResult>;

export const zBouncerV1Routes = {
  post: {
    "/v1/bouncer/check": {
      method: "post",
      path: "/v1/bouncer/check",
      headers: ZReqHeadersAuthorization,
      body: z.array(
        z.object({
          email: z.email(),
        })
      ),
      response: {
        "200": z.array(zEmailResult),
      },
      securityScheme: {
        auth: "api-key",
        ressources: {},
        access: null,
      },
      openapi: {
        tags: ["v1"] as string[],
      },
    },
  },
} as const satisfies IRoutesDef;
