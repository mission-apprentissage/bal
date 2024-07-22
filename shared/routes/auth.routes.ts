import { z } from "zod";

import { ZUser, zUserWithPersonPublic } from "../models/user.model";
import { IRoutesDef, ZReqHeadersAuthorization, ZResOk } from "./common.routes";

export const zAuthRoutes = {
  get: {
    "/auth/reset-password": {
      method: "get",
      path: "/auth/reset-password",
      querystring: z.object({ email: z.string().email() }),
      response: {
        "200": ZResOk,
      },
      securityScheme: null,
    },
    "/auth/logout": {
      method: "get",
      path: "/auth/logout",
      response: {
        "200": ZResOk,
      },
      securityScheme: null,
    },
    "/auth/session": {
      method: "get",
      path: "/auth/session",
      response: {
        "200": zUserWithPersonPublic,
      },
      headers: ZReqHeadersAuthorization,
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  post: {
    "/auth/reset-password": {
      method: "post",
      path: "/auth/reset-password",
      body: z.object({
        password: ZUser.shape.password,
      }),
      response: {
        "200": ZResOk,
      },
      securityScheme: {
        auth: "access-token",
        access: null,
        ressources: {},
      },
    },
    "/auth/login": {
      method: "post",
      path: "/auth/login",
      body: z.object({
        email: ZUser.shape.email,
        password: ZUser.shape.password,
      }),
      response: {
        "200": zUserWithPersonPublic,
      },
      securityScheme: null,
    },
  },
} as const satisfies IRoutesDef;

export interface IStatus {
  error?: boolean;
  message?: string;
}
