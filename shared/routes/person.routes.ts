import { z } from "zod/v4-mini";

import { zObjectId } from "../models/common";
import { ZPerson } from "../models/person.model";
import type { IRoutesDef } from "./common.routes";
import { ZReqParamsSearchPagination } from "./common.routes";

export const zPersonRoutes = {
  get: {
    "/admin/persons": {
      method: "get",
      path: "/admin/persons",
      querystring: ZReqParamsSearchPagination,
      response: {
        "200": z.object({
          persons: z.array(ZPerson),
          pagination: z.object({
            page: z.number(),
            size: z.number(),
            total: z.number(),
          }),
        }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
    "/admin/persons/:id": {
      method: "get",
      path: "/admin/persons/:id",
      params: z.object({ id: zObjectId }),
      response: {
        "200": ZPerson,
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
