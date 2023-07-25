import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZPerson } from "../models/person.model";
import { ZUser, ZUserPublic } from "../models/user.model";
import { ZReqParamsSearchPagination } from "./common.routes";

const zUserWithPerson = ZUserPublic.extend({
  person: ZPerson.nullish(),
});

export const zUserAdminRoutes = {
  get: {
    "/admin/users": {
      querystring: ZReqParamsSearchPagination,
      response: { "2xx": z.array(zUserWithPerson) },
    },
    "/admin/users/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: { "2xx": zUserWithPerson },
    },
  },
  post: {
    "/admin/user": {
      body: z.object({
        email: ZUser.shape.email,
        password: ZUser.shape.password,
        organisation_id: z.string(),
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
