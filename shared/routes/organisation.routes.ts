import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZOrganisation } from "../models/organisation.model";
import { IRoutesDef, ZReqParamsSearchPagination } from "./common.routes";

export const zAdminOrganisationRoutes = {
  get: {
    "/admin/organisations": {
      method: "get",
      path: "/admin/organisations",
      querystring: ZReqParamsSearchPagination,
      response: {
        "200": z.array(ZOrganisation),
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
    "/admin/organisations/:id": {
      method: "get",
      path: "/admin/organisations/:id",
      params: z.object({ id: zObjectId }),
      response: {
        "200": ZOrganisation,
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
