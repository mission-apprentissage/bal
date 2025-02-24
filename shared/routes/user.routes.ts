import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZUser, zUserWithPersonPublic } from "../models/user.model";
import { IRoutesDef, ZReqParamsSearchPagination } from "./common.routes";

export const zUserAdminRoutes = {
  get: {
    "/admin/users": {
      method: "get",
      path: "/admin/users",
      querystring: ZReqParamsSearchPagination,
      response: { "200": z.array(zUserWithPersonPublic) },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
    "/admin/users/:id": {
      method: "get",
      path: "/admin/users/:id",
      params: z.object({ id: zObjectId }),
      response: { "200": zUserWithPersonPublic },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
  post: {
    "/admin/user": {
      method: "post",
      path: "/admin/user",
      body: z.object({
        email: ZUser.shape.email,
        password: ZUser.shape.password,
        organisation_id: z.string(),
      }),
      response: {
        "200": zUserWithPersonPublic,
      },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
  delete: {
    "/admin/users/:id": {
      method: "delete",
      path: "/admin/users/:id",
      params: z.object({ id: zObjectId }),
      response: { "200": z.object({ success: z.literal(true) }) },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;

export const zUserRoutes = {
  get: {
    "/user/generate-api-key": {
      method: "get",
      path: "/user/generate-api-key",
      response: {
        "200": z.object({ api_key: z.string() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
