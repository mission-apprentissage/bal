import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZDocument, zDocumentPublic } from "../models/document.model";

export const zUploadRoutes = {
  get: {
    "/admin/documents": {
      response: {
        "2xx": z.array(zDocumentPublic),
      },
    },
    "/admin/documents/types": {
      response: {
        "2xx": z.array(z.string()),
      },
    },
  },
  post: {
    "/admin/upload": {
      querystring: z
        .object({
          type_document: z.string(),
          import_content: z.string().optional(),
        })
        .strict(),
      body: z.unknown(),
      response: {
        "2xx": ZDocument,
      },
    },
  },
  put: {},
  delete: {
    "/admin/document/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": z.object({ success: z.boolean() }).strict(),
      },
    },
  },
};
