import type { oas31 } from "openapi3-ts";
import type { Jsonify } from "type-fest";
import type { $ZodObject, $ZodType } from "zod/v4/core";
import { z } from "zod/v4-mini";
import type { ZodMiniObject } from "zod/v4-mini";
import type { AccessPermission, AccessRessouces } from "../security/permissions";

export const ZResError = z.object({
  data: z.optional(z.any()),
  code: z.nullish(z.string()),
  message: z.string(),
  name: z.string(),
  statusCode: z.number(),
});

export const ZResOk = z.object({});

export type IResError = z.input<typeof ZResError>;
export type IResErrorJson = Jsonify<z.output<typeof ZResError>>;

export const ZReqParamsSearchPagination = z.object({
  page: z.optional(z.coerce.number().check(z.int(), z.gte(0))),
  limit: z.optional(z.coerce.number().check(z.int(), z.gte(0))),
  q: z.optional(z.string()),
});

export const ZReqHeadersAuthorization = z.looseObject({
  Authorization: z.optional(z.string()),
});

type AuthStrategy = "api-key" | "cookie-session" | "access-token" | "brevo-api-key";

export type SecurityScheme = {
  auth: AuthStrategy;
  access: AccessPermission | null;
  ressources: AccessRessouces;
};

interface IRouteSchemaCommon {
  path: string;
  querystring?: ZodMiniObject;
  headers?: $ZodObject;
  params?: $ZodObject;
  response: { [statuscode: `${1 | 2 | 3 | 4 | 5}${string}`]: $ZodType };
  openapi?: null | Omit<oas31.OperationObject, "parameters" | "requestBody" | "requestParams" | "responses">;
  securityScheme: SecurityScheme | null;
}

export interface IRouteSchemaGet extends IRouteSchemaCommon {
  method: "get";
}

export interface IRouteSchemaWrite extends IRouteSchemaCommon {
  method: "post" | "put" | "patch" | "delete";
  body?: $ZodType;
}

export type WithSecurityScheme = {
  securityScheme: SecurityScheme;
};

export type IRouteSchema = IRouteSchemaGet | IRouteSchemaWrite;
export type ISecuredRouteSchema = IRouteSchema & WithSecurityScheme;

export type IRoutesDef = {
  get?: Record<string, IRouteSchemaGet>;
  post?: Record<string, IRouteSchemaWrite>;
  put?: Record<string, IRouteSchemaWrite>;
  delete?: Record<string, IRouteSchemaWrite>;
  patch?: Record<string, IRouteSchemaWrite>;
};
