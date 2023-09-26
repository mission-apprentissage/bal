import { z } from "zod";

import { ZUser, ZUserPublic } from "../models/user.model";
import { ZReqHeadersAuthorization, ZResOk } from "./common.routes";

export const zAuthRoutes = {
  get: {
    "/auth/reset-password": {
      querystring: z.object({ email: z.string().email() }).strict(),
      response: {
        "2xx": ZResOk,
      },
    },
    "/auth/logout": {
      response: {
        "2xx": ZResOk,
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
        "2xx": ZResOk,
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
        "2xx": ZUserPublic,
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
