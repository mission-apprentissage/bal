import { z } from "zod/v4-mini";
import { ZUserPublic } from "../../models/user.model";
import { zObjectId } from "../../models/common";
import type { IRoutesDef } from "../common.routes";

export const zUserPrivateRoutes = {
  get: {
    "/_private/users/:id": {
      method: "get",
      path: "/_private/users/:id",
      params: z.object({ id: zObjectId }),
      response: { "200": ZUserPublic },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
