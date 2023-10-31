import { z } from "zod";

import { zObjectId } from "../models/common";
import { zDocumentPublic } from "../models/document.model";
import { IRoutesDef } from "./common.routes";

export const zUploadRoutes = {
  get: {
    "/admin/documents": {
      method: "get",
      path: "/admin/documents",
      response: {
        "200": z.array(zDocumentPublic),
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
    "/admin/documents/types": {
      method: "get",
      path: "/admin/documents/types",
      response: {
        "200": z.array(z.string()),
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
  post: {
    "/admin/upload": {
      method: "post",
      path: "/admin/upload",
      querystring: z
        .object({
          type_document: z.string(),
          import_content: z.string().optional(),
        })
        .strict(),
      body: z.unknown(),
      response: {
        "200": zDocumentPublic,
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
  delete: {
    "/admin/document/:id": {
      method: "delete",
      path: "/admin/document/:id",
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "200": z.object({ success: z.boolean() }).strict(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
