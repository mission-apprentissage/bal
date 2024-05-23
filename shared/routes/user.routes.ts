import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZPerson } from "../models/person.model";
import { ZUser, ZUserPublic, zUserWithPersonPublic } from "../models/user.model";
import { IRoutesDef, ZReqParamsSearchPagination } from "./common.routes";

const zUserWithPerson = ZUserPublic.extend({
  person: ZPerson.nullish(),
});

export const zUserAdminRoutes = {
  get: {
    "/admin/users": {
      method: "get",
      path: "/admin/users",
      querystring: ZReqParamsSearchPagination,
      response: { "200": z.array(zUserWithPerson) },
      securityScheme: {
        auth: "cookie-session",
        access: "admin",
        ressources: {},
      },
    },
    "/admin/users/:id": {
      method: "get",
      path: "/admin/users/:id",
      params: z.object({ id: zObjectId }).strict(),
      response: { "200": zUserWithPerson },
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
      body: z
        .object({
          email: ZUser.shape.email,
          password: ZUser.shape.password,
          organisation_id: z.string(),
        })
        .strict(),
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
} as const satisfies IRoutesDef;

export const zUserRoutes = {
  get: {
    "/user/generate-api-key": {
      method: "get",
      path: "/user/generate-api-key",
      response: {
        "200": z.object({ api_key: z.string() }).strict(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
