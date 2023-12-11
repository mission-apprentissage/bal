import Boom from "@hapi/boom";
import { FastifyRequest } from "fastify";
import { IUserWithPerson } from "shared/models/user.model";
import { IRouteSchema, WithSecurityScheme } from "shared/routes/common.routes";
import { AccessPermission, AdminRole, NoneRole, Role, SupportRole } from "shared/security/permissions";

import { IAccessToken } from "./accessTokenService";
import { getUserFromRequest } from "./authenticationService";

// Specify what we need to simplify mocking in tests
type IRequest = Pick<FastifyRequest, "user" | "params" | "query">;

function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

export function getUserRole(userOrToken: IAccessToken | IUserWithPerson): Role {
  if ("identity" in userOrToken) {
    return NoneRole;
  }

  return userOrToken.is_admin ? AdminRole : userOrToken.is_support ? SupportRole : NoneRole;
}

export function isAuthorized<S extends Pick<IRouteSchema, "method" | "path"> & WithSecurityScheme>(
  access: AccessPermission,
  userOrToken: IAccessToken | IUserWithPerson,
  role: Role,
  schema: S
): boolean {
  if (typeof access === "object") {
    if ("some" in access) {
      return access.some.some((a) => isAuthorized(a, userOrToken, role, schema));
    }

    if ("every" in access) {
      return access.every.every((a) => isAuthorized(a, userOrToken, role, schema));
    }

    assertUnreachable(access);
  }

  return role.permissions.includes(access);
}

export async function authorizationnMiddleware<S extends Pick<IRouteSchema, "method" | "path"> & WithSecurityScheme>(
  schema: S,
  req: IRequest
) {
  if (!schema.securityScheme) {
    throw Boom.internal(`authorizationnMiddleware: route doesn't have security scheme`, {
      method: schema.method,
      path: schema.path,
    });
  }

  const userWithType = getUserFromRequest(req, schema);

  if (schema.securityScheme.access === null) {
    return;
  }

  const role = getUserRole(userWithType);

  if (!isAuthorized(schema.securityScheme.access, userWithType, role, schema)) {
    throw Boom.forbidden();
  }
}
