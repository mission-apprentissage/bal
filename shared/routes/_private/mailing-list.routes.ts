import { z } from "zod/v4-mini";
import { zObjectIdMini } from "zod-mongodb-schema";
import type { IRoutesDef } from "../common.routes";
import { ZMailingListV2, zMailingListV2ConfigUpdateQuery } from "../../models/mailingListV2.model";
import { ZMailingListSource } from "../../models/mailingList.source.model";

export const zPrivateMailingListRoutes = {
  get: {
    "/_private/mailing-list/:id": {
      method: "get",
      path: "/_private/mailing-list/:id",
      params: z.object({
        id: zObjectIdMini,
      }),
      response: {
        "200": z.nullable(ZMailingListV2),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/source/sample": {
      method: "get",
      path: "/_private/mailing-list/:id/source/sample",
      params: z.object({
        id: zObjectIdMini,
      }),
      response: {
        "200": z.array(ZMailingListSource.shape.data),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list": {
      method: "get",
      path: "/_private/mailing-list",
      querystring: z.object({
        page: z.coerce.number().check(z.int(), z.gte(0)),
        size: z.coerce.number().check(z.int(), z.gte(1)),
        sort: z.enum(["created_at", "updated_at", "name", "status", "ttl"]),
        sortOrder: z.enum(["asc", "desc"]),
      }),
      response: {
        "200": z.object({
          items: z.array(ZMailingListV2),
          total: z.number(),
          page: z.number(),
          size: z.number(),
        }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/output/download": {
      method: "get",
      path: "/_private/mailing-list/:id/output/download",
      params: z.object({
        id: zObjectIdMini,
      }),
      response: {
        "200": z.unknown(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/source/download": {
      method: "get",
      path: "/_private/mailing-list/:id/source/download",
      params: z.object({
        id: zObjectIdMini,
      }),
      response: {
        "200": z.unknown(),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  post: {
    "/_private/mailing-list": {
      method: "post",
      path: "/_private/mailing-list",
      querystring: z.object({
        name: z.string(),
        delimiter: z.string(),
        expiresInDays: z.pipe(z.string().check(z.regex(/^\d{1,3}$/)), z.coerce.number()),
      }),
      body: z.unknown(),
      response: {
        "200": z.object({ _id: zObjectIdMini }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/schedule": {
      method: "post",
      path: "/_private/mailing-list/:id/schedule",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: z.object({
        status: z.enum(["parse:scheduled", "generate:scheduled", "export:scheduled"]),
      }),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/reset": {
      method: "post",
      path: "/_private/mailing-list/:id/reset",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: z.object({
        status: z.enum(["initial", "parse:success"]),
      }),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/kill": {
      method: "post",
      path: "/_private/mailing-list/:id/kill",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: z.unknown(),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/generate": {
      method: "post",
      path: "/_private/mailing-list/:id/generate",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: z.unknown(),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  put: {
    "/_private/mailing-list/:id/config": {
      method: "put",
      path: "/_private/mailing-list/:id/config",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: zMailingListV2ConfigUpdateQuery,
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/name": {
      method: "put",
      path: "/_private/mailing-list/:id/name",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: z.object({
        name: ZMailingListV2.shape.name,
      }),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
    "/_private/mailing-list/:id/source": {
      method: "put",
      path: "/_private/mailing-list/:id/source",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: z.object({
        name: z.string(),
        delimiter: z.string(),
        expiresInDays: z
          .number()
          .check(
            z.minimum(1, "La durée d'expiration doit être au moins de 1 jour"),
            z.maximum(365, "La durée d'expiration ne peut pas dépasser 365 jours")
          ),
      }),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
  delete: {
    "/_private/mailing-list/:id": {
      method: "delete",
      path: "/_private/mailing-list/:id",
      params: z.object({
        id: zObjectIdMini,
      }),
      body: z.unknown(),
      response: {
        "200": z.object({ success: z.boolean() }),
      },
      securityScheme: {
        auth: "cookie-session",
        access: null,
        ressources: {},
      },
    },
  },
} as const satisfies IRoutesDef;
