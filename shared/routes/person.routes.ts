import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZPersonWithOrganisation } from "../models/person.model";
import { IRoutesDef, ZReqParamsSearchPagination } from "./common.routes";

export const zPersonRoutes = {
  get: {
    "/admin/persons": {
      method: "get",
      path: "/admin/persons",
      querystring: ZReqParamsSearchPagination,
      response: {
        "200": z.array(ZPersonWithOrganisation),
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
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "200": ZPersonWithOrganisation,
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
