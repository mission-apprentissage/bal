import { z } from "zod";

import type { IRoutesDef } from "./common.routes";
import { ZResOk } from "./common.routes";

export const zUploadSupportRoutes = {
  get: {
    "/support/files-list": {
      method: "get",
      path: "/support/files-list",
      response: {
        "200": z.array(
          z.object({
            id: z.string(),
          })
        ),
      },
      securityScheme: {
        auth: "cookie-session",
        access: { some: ["support", "admin"] },
        ressources: {},
      },
    },
    "/support/file/download": {
      method: "get",
      path: "/support/file/download",
      querystring: z.object({
        id: z.string(),
      }),
      response: {
        "200": z.unknown(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: { some: ["support", "admin"] },
        ressources: {},
      },
    },
  },
  post: {
    "/support/upload": {
      method: "post",
      path: "/support/upload",
      querystring: z.object({
        verified_key: z.string(),
        email: z.string().email(),
      }),
      body: z.unknown(),
      response: {
        "200": ZResOk,
      },
      securityScheme: null,
    },
  },
  delete: {
    "/support/file/delete": {
      method: "delete",
      path: "/support/file/delete",
      querystring: z.object({
        id: z.string(),
      }),
      response: {
        "200": z.object({ success: z.literal(true) }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: { some: ["support", "admin"] },
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
