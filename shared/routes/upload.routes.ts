import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZUploadDocumentPublic } from "../models/document.model";
import { ZMailingListWithDocumenAndOwner } from "../models/mailingList.model";
import type { IRoutesDef } from "./common.routes";

export const zUploadRoutes = {
  get: {
    "/admin/documents": {
      method: "get",
      path: "/admin/documents",
      response: {
        "200": z.array(ZUploadDocumentPublic),
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
    "/admin/mailing-list/:user_id": {
      method: "get",
      path: "/admin/mailing-list/:user_id",
      params: z.object({ user_id: zObjectId }),
      response: {
        "200": z.array(ZMailingListWithDocumenAndOwner),
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
    "/admin/document/:id/download": {
      method: "get",
      path: "/admin/document/:id/download",
      params: z.object({ id: zObjectId }),
      response: {
        "200": z.unknown(),
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
      querystring: z.object({
        type_document: z.string(),
        delimiter: z.string(),
      }),
      body: z.unknown(),
      response: {
        "200": ZUploadDocumentPublic,
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
  put: {
    "/admin/document/:id/resume": {
      method: "put",
      path: "/admin/document/:id/resume",
      params: z.object({ id: zObjectId }),
      response: {
        "200": ZUploadDocumentPublic,
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
      params: z.object({ id: zObjectId }),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
