import Boom from "@hapi/boom";
import type { FastifyRequest } from "fastify";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import type { IUserWithPerson } from "shared/models/user.model";
import type { ISecuredRouteSchema, WithSecurityScheme } from "shared/routes/common.routes";
import type { UserWithType } from "shared/security/permissions";

import { compareKeys } from "../common/utils/cryptoUtils";
import { decodeToken } from "../common/utils/jwtUtils";
import { getSession } from "../modules/actions/sessions.actions";
import { findUser, updateUser } from "../modules/actions/users.actions";
import type { IAccessToken } from "./accessTokenService";
import { parseAccessToken } from "./accessTokenService";
import config from "@/config";

export type IUserWithType =
  | UserWithType<"token", IAccessToken>
  | UserWithType<"user", IUserWithPerson>
  | UserWithType<"brevo", IBrevo>;

type IBrevo = Record<string, never>;

declare module "fastify" {
  interface FastifyRequest {
    user?: null | IUserWithType;
  }
}

type AuthenticatedUser<AuthScheme extends WithSecurityScheme["securityScheme"]["auth"]> =
  AuthScheme extends "access-token"
    ? UserWithType<"token", IAccessToken>
    : AuthScheme extends "api-key" | "cookie-session"
      ? UserWithType<"user", IUserWithPerson>
      : never;

export const getUserFromRequest = <S extends WithSecurityScheme>(
  req: Pick<FastifyRequest, "user">,
  _schema: S
): AuthenticatedUser<S["securityScheme"]["auth"]>["value"] => {
  if (!req.user) {
    throw Boom.internal("User should be authenticated");
  }

  return req.user.value as AuthenticatedUser<S["securityScheme"]["auth"]>["value"];
};

async function authCookieSession(req: FastifyRequest): Promise<UserWithType<"user", IUserWithPerson> | null> {
  const token = req.cookies?.[config.session.cookieName];

  if (!token) {
    throw Boom.forbidden("Session invalide");
  }

  try {
    const session = await getSession({ token });

    if (!session) {
      return null;
    }

    const { email } = jwt.verify(token, config.auth.user.jwtSecret) as JwtPayload;

    const user = await findUser({ email: email.toLowerCase() });

    return user ? { type: "user", value: user } : user;
  } catch (_error) {
    return null;
  }
}

async function authApiKey(req: FastifyRequest): Promise<UserWithType<"user", IUserWithPerson> | null> {
  const token = extractBearerTokenFromHeader(req);

  if (!token) {
    throw Boom.forbidden("Jeton manquant");
  }

  try {
    const { _id, api_key } = decodeToken(token) as JwtPayload;

    const user = await findUser({ _id: new ObjectId(_id) });

    if (!user || !user?.api_key || !compareKeys(user.api_key, api_key)) {
      throw Boom.forbidden("Jeton invalide");
    }

    const api_key_used_at = new Date();

    await updateUser(user.email, { api_key_used_at });
    return user ? { type: "user", value: { ...user, api_key_used_at } } : null;
  } catch (_error) {
    throw Boom.forbidden("Jeton invalide");
  }
}

const bearerRegex = /^bearer\s+(\S+)$/i;
function extractBearerTokenFromHeader(req: FastifyRequest): null | string {
  const { authorization } = req.headers;

  if (!authorization) {
    return null;
  }

  const matches = authorization.match(bearerRegex);

  return matches === null ? null : matches[1];
}

async function authAccessToken<S extends ISecuredRouteSchema>(
  req: FastifyRequest,
  schema: S
): Promise<UserWithType<"token", IAccessToken> | null> {
  const token = parseAccessToken(extractBearerTokenFromHeader(req), schema);

  if (token === null) {
    return null;
  }

  return token ? { type: "token", value: token } : null;
}

function authBrevoApiKey(req: FastifyRequest): UserWithType<"brevo", IBrevo> | null {
  const { apiKey } = req.query as { apiKey: string };

  if (config.brevo.webhookApiKey !== apiKey) {
    throw Boom.forbidden("Invalid API key");
  }

  return { type: "brevo", value: {} };
}

function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

export async function authenticationMiddleware<S extends ISecuredRouteSchema>(schema: S, req: FastifyRequest) {
  if (!schema.securityScheme) {
    throw Boom.internal("Missing securityScheme");
  }

  const securityScheme = schema.securityScheme;

  switch (securityScheme.auth) {
    case "cookie-session":
      req.user = await authCookieSession(req);
      break;
    case "api-key":
      req.user = await authApiKey(req);
      break;
    case "access-token":
      req.user = await authAccessToken(req, schema);
      break;
    case "brevo-api-key":
      req.user = authBrevoApiKey(req);
      break;
    default:
      assertUnreachable(securityScheme.auth);
  }

  if (!req.user) {
    throw Boom.unauthorized();
  }
}
