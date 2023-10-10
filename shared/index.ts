import { ObjectId } from "bson";
import { Jsonify } from "type-fest";
import z, { ZodType } from "zod";

import { zAuthRoutes } from "./routes/auth.routes";
import { zCoreRoutes } from "./routes/core.routes";
import { zDocumentRoutes } from "./routes/document.routes";
import { zUploadRoutes } from "./routes/upload.routes";
import { zUserAdminRoutes, zUserRoutes } from "./routes/user.routes";
import { zGeoRoutes } from "./routes/v1/geo.route";
import { zNafRoutes } from "./routes/v1/naf.route";
import { zSiretRoutes } from "./routes/v1/siret.route";
import { zTcoRoutes } from "./routes/v1/tco.route";

export type deserialize = [
  {
    pattern: {
      type: "string";
      format: "date-time";
    };
    output: Date;
  },
  {
    pattern: {
      type: "string";
      format: "ObjectId";
    };
    output: ObjectId;
  },
];

export const zRoutes = {
  get: {
    ...zUserAdminRoutes.get,
    ...zUserRoutes.get,
    ...zAuthRoutes.get,
    ...zCoreRoutes.get,
    ...zUploadRoutes.get,
    ...zDocumentRoutes.get,
    ...zSiretRoutes.get,
    ...zGeoRoutes.get,
    ...zTcoRoutes.get,
    ...zNafRoutes.get,
  },
  post: {
    ...zUserAdminRoutes.post,
    ...zUserRoutes.post,
    ...zAuthRoutes.post,
    ...zCoreRoutes.post,
    ...zUploadRoutes.post,
    ...zSiretRoutes.post,
    ...zGeoRoutes.post,
    ...zTcoRoutes.post,
    ...zNafRoutes.post,
  },
  put: {
    ...zUserAdminRoutes.put,
    ...zUserRoutes.put,
    ...zAuthRoutes.put,
    ...zCoreRoutes.put,
    ...zUploadRoutes.put,
    ...zSiretRoutes.put,
    ...zGeoRoutes.put,
    ...zTcoRoutes.put,
    ...zNafRoutes.put,
  },
  delete: {
    ...zUserAdminRoutes.delete,
    ...zUserRoutes.delete,
    ...zAuthRoutes.delete,
    ...zCoreRoutes.delete,
    ...zUploadRoutes.delete,
    ...zSiretRoutes.delete,
    ...zGeoRoutes.delete,
    ...zTcoRoutes.delete,
    ...zNafRoutes.delete,
  },
} as const;

export type IRoutes = typeof zRoutes;

export type IGetRoutes = IRoutes["get"];
export type IPostRoutes = IRoutes["post"];
export type IPutRoutes = IRoutes["put"];
export type IDeleteRoutes = IRoutes["delete"];

export interface IRouteSchema {
  body?: ZodType;
  querystring?: ZodType;
  headers?: ZodType<Record<string, string | undefined> | undefined>;
  params?: ZodType;
  response: { "2xx": ZodType };
}

export type IResponse<S extends IRouteSchema> = S["response"]["2xx"] extends ZodType
  ? Jsonify<z.output<S["response"]["2xx"]>>
  : never;

export type IBody<S extends IRouteSchema> = S["body"] extends ZodType ? z.input<S["body"]> : never;

export type IQuery<S extends IRouteSchema> = S["querystring"] extends ZodType ? z.input<S["querystring"]> : never;

export type IParam<S extends IRouteSchema> = S["params"] extends ZodType ? z.input<S["params"]> : never;

export type IHeaders<S extends IRouteSchema> = S["headers"] extends ZodType ? z.input<S["headers"]> : never;

export type IRequest<S extends IRouteSchema> = {
  [Prop in keyof Omit<S, "response">]: S[Prop] extends ZodType ? z.input<S[Prop]> : never;
};
