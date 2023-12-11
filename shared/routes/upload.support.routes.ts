import { z } from "zod";

import { IRoutesDef, ZResOk } from "./common.routes";

export const zUploadSupportRoutes = {
  get: {
    "/support/files-list": {
      method: "get",
      path: "/support/files-list",
      response: {
        "200": z.array(
          z
            .object({
              id: z.string(),
            })
            .strict()
        ),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/support/file/download": {
      method: "get",
      path: "/support/file/download",
      querystring: z
        .object({
          id: z.string(),
        })
        .strict(),
      response: {
        "200": z.unknown(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  post: {
    "/support/upload": {
      method: "post",
      path: "/support/upload",
      querystring: z
        .object({
          verified_key: z.string(),
          email: z.string().email(),
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
