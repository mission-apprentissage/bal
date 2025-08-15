import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import type { IUser } from "shared/models/user.model";
import type { IRouteSchema, ISecuredRouteSchema, WithSecurityScheme } from "shared/routes/common.routes";

import config from "@/config";

type IScope<S extends Pick<IRouteSchema, "method" | "path"> & WithSecurityScheme> = {
  path: S["path"];
  method: S["method"];
  resources: {
    [key in keyof S["securityScheme"]["ressources"]]: ReadonlyArray<string>;
  };
};

export type IAccessToken<
  S extends Pick<IRouteSchema, "method" | "path"> & WithSecurityScheme = Pick<IRouteSchema, "method" | "path"> &
    WithSecurityScheme,
> = {
  identity: {
    email: string;
  };
  scopes: ReadonlyArray<IScope<S>>;
};

function getAudience<S extends Pick<IRouteSchema, "method" | "path">>(scopes: ReadonlyArray<S>): string[] {
  return scopes.map((scope) => `${scope.method} ${scope.path}`.toLowerCase());
}

type RouteResources<S extends ISecuredRouteSchema> = {
  [key in keyof S["securityScheme"]["ressources"]]: ReadonlyArray<string>;
};

export function generateAccessToken<S extends ISecuredRouteSchema>(
  user: IUser | IAccessToken["identity"],
  routes: ReadonlyArray<{ route: S; resources: RouteResources<S> }>,
  options: { expiresIn?: SignOptions["expiresIn"] } = {}
): string {
  const audience = getAudience(routes.map((r) => r.route));

  const identity: IAccessToken["identity"] = { email: user.email.toLowerCase() };

  const data: IAccessToken<S> = {
    identity,
    scopes: routes.map((route) => {
      return {
        path: route.route.path,
        method: route.route.method,
        resources: route.resources,
      };
    }),
  };

  const signOptions: SignOptions = {
    audience,
    expiresIn: options.expiresIn ?? config.auth.user.expiresIn,
    issuer: config.publicUrl,
  };
  return jwt.sign(data, config.auth.user.jwtSecret, signOptions);
}

export function parseAccessToken<S extends Pick<IRouteSchema, "method" | "path"> & WithSecurityScheme>(
  accessToken: null | string,
  schema: Pick<S, "method" | "path">
): IAccessToken<S> | null {
  if (!accessToken) {
    return null;
  }

  const data = jwt.verify(accessToken, config.auth.user.jwtSecret, {
    complete: true,
    audience: getAudience([schema])[0],
    issuer: config.publicUrl,
  });

  const token = data.payload as IAccessToken<S>;

  return token;
}
