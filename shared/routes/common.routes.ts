import { oas31 } from "openapi3-ts";
import { Jsonify } from "type-fest";
import { AnyZodObject, ZodType } from "zod";

import { z } from "../helpers/zodWithOpenApi";
import { AccessPermission, AccessRessouces } from "../security/permissions";

export const ZResError = z.object({
  data: z
    .any()
    .optional()
    .openapi({
      description: "Données contextuelles liées à l'erreur",
      example: {
        validationError: {
          issues: [
            {
              code: "invalid_type",
              expected: "number",
              received: "nan",
              path: ["longitude"],
              message: "Number attendu",
            },
          ],
          name: "ZodError",
          statusCode: 400,
          code: "FST_ERR_VALIDATION",
          validationContext: "querystring",
        },
      },
    }),
  code: z.string().nullish(),
  message: z.string().openapi({
    description: "Un message explicatif de l'erreur",
    example: "querystring.longitude: Number attendu",
  }),
  name: z.string().openapi({
    description: "Le type générique de l'erreur",
    example: "Bad Request",
  }),
  statusCode: z.number().openapi({
    description: "Le status code retourné",
    example: 400,
  }),
});

export const ZResOk = z.object({});

export type IResError = z.input<typeof ZResError>;
export type IResErrorJson = Jsonify<z.output<typeof ZResError>>;

export const ZReqParamsSearchPagination = z.object({
  page: z.preprocess((v) => parseInt(v as string, 10), z.number().positive().optional()),
  limit: z.preprocess((v) => parseInt(v as string, 10), z.number().positive().optional()),
  q: z.string().optional(),
});
export type IReqParamsSearchPagination = z.input<typeof ZReqParamsSearchPagination>;

export const ZReqHeadersAuthorization = z
  .object({
    Authorization: z.string().describe("Bearer token").optional(),
  })
  .passthrough();

export type AuthStrategy = "api-key" | "cookie-session" | "access-token" | "brevo-api-key";

export type SecurityScheme = {
  auth: AuthStrategy;
  access: AccessPermission | null;
  ressources: AccessRessouces;
};

interface IRouteSchemaCommon {
  path: string;
  querystring?: AnyZodObject;
  headers?: AnyZodObject;
  params?: AnyZodObject;
  response: { [statuscode: `${1 | 2 | 3 | 4 | 5}${string}`]: ZodType };
  openapi?: null | Omit<oas31.OperationObject, "parameters" | "requestBody" | "requestParams" | "responses">;
  securityScheme: SecurityScheme | null;
}

export interface IRouteSchemaGet extends IRouteSchemaCommon {
  method: "get";
}

export interface IRouteSchemaWrite extends IRouteSchemaCommon {
  method: "post" | "put" | "patch" | "delete";
  body?: ZodType;
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
