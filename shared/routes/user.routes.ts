import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZUser, ZUserPublic } from "../models/user.model";
import { ZReqParamsSearchPagination } from "./common.routes";

export const zUserAdminRoutes = {
  get: {
    "/admin/users": {
      querystring: ZReqParamsSearchPagination,
      response: { "2xx": z.array(ZUserPublic) },
    },
    "/admin/users/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: { "2xx": ZUserPublic },
    },
  },
  post: {
    "/admin/user": {
      body: z.object({
        email: ZUser.shape.email,
        password: ZUser.shape.password,
      }),
      response: {
        "2xx": ZUserPublic,
      },
    },
  },
  put: {},
  delete: {},
} as const;

export const zUserRoutes = {
  get: {
    "/user/generate-api-key": {
      response: {
        "2xx": z.object({ api_key: z.string() }).strict(),
      },
    },
  },
  post: {},
  put: {},
  delete: {},
};
