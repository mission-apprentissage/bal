import { z } from "zod";

import { ZDocumentContent } from "../models/documentContent.model";
import type { IRoutesDef } from "./common.routes";

export const zDocumentRoutes = {
  get: {
    "/documents/columns": {
      method: "get",
      path: "/documents/columns",
      querystring: z.object({
        type: z.string(),
      }),
      response: {
        "200": z.array(z.string()),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/documents/types": {
      method: "get",
      path: "/documents/types",
      response: {
        "200": z.array(z.string()),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/documents/sample": {
      method: "get",
      path: "/documents/sample",
      querystring: z.object({
        type: z.string(),
      }),
      response: {
        "200": z.array(ZDocumentContent),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
