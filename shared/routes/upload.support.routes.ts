import { z } from "zod";

import { IRoutesDef, ZResOk } from "./common.routes";

export const zUploadSupportRoutes = {
  post: {
    "/support/upload": {
      method: "post",
      path: "/support/upload",
      querystring: z
        .object({
          verified_key: z.string(),
          email: z.string(),
        })
        .strict(),
      body: z.unknown(),
      response: {
        "200": ZResOk,
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;
