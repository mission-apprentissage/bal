import { z } from "zod";

import {
  ZUser,
  ZUserPublic,
  zUserWithPersonPublic,
} from "../models/user.model";
import { ZReqHeadersAuthorization } from "./common.routes";

export const zAuthRoutes = {
  get: {
    "/auth/reset-password": {
      querystring: z.object({ email: z.string().email() }).strict(),
      response: {
        "2xx": z.undefined(),
      },
    },
    "/auth/logout": {
      response: {
        "2xx": z.undefined(),
      },
    },
    "/auth/session": {
      response: {
        "2xx": ZUserPublic,
      },
      headers: ZReqHeadersAuthorization,
    },
  },
  post: {
    "/auth/reset-password": {
      body: z
        .object({
          password: ZUser.shape.password,
          token: z.string(),
        })
        .strict(),
      response: {
        "2xx": z.undefined(),
      },
    },
    "/auth/login": {
      body: z
        .object({
          email: ZUser.shape.email,
          password: ZUser.shape.password,
        })
        .strict(),
      response: {
        "2xx": zUserWithPersonPublic,
      },
    },
  },
  put: {},
  delete: {},
};

export interface IStatus {
  error?: boolean;
  message?: string;
}
