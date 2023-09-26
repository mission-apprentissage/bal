import { FastifyAuthFunction } from "@fastify/auth";
import Boom from "@hapi/boom";
import { FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";

import config from "@/config";

import { compareKeys } from "../../../common/utils/cryptoUtils";
import { decodeToken } from "../../../common/utils/jwtUtils";
import { getSession } from "../../actions/sessions.actions";
import { findUser, updateUser } from "../../actions/users.actions";

declare module "fastify" {
  export interface FastifyRequest {
    user?: IUser;
  }
}

// ne pas utiliser done() pour les fonctions async

export const authValidateJWT: FastifyAuthFunction = async (request, _reply) => {
  let token: string | undefined = request.raw.headers["authorization"];
  if (!token) {
    throw Boom.forbidden("Jeton manquant");
  }

  if (token.startsWith("Bearer ")) {
    token = token.substring(7, token.length);
  } else {
    throw Boom.forbidden("Jeton invalide");
  }

  try {
    const { _id, api_key } = decodeToken(token) as JwtPayload;

    const user = await findUser({ _id: new ObjectId(_id) });

    if (!user || !user?.api_key || !compareKeys(user.api_key, api_key)) {
      throw Boom.forbidden("Jeton invalide");
    }

    const api_key_used_at = new Date();

    await updateUser(user, { api_key_used_at });
    request.user = { ...user, api_key_used_at };
  } catch (error) {
    throw Boom.forbidden("Jeton invalide");
  }
};

export const authValidateSession: FastifyAuthFunction = async (request, _reply) => {
  const token = request.cookies?.[config.session.cookieName];

  if (!token) {
    throw Boom.forbidden("Session invalide");
  }

  try {
    const session = await getSession({ token });

    if (!session) {
      throw Boom.forbidden("Session invalide");
    }

    const { email } = decodeToken(token) as JwtPayload;

    const user = await findUser({ email });

    if (!user) {
      throw Boom.forbidden("Session invalide");
    }

    request.user = user;
  } catch (error) {
    throw Boom.forbidden("Session invalide");
  }
};

export const authWebHookKey: FastifyAuthFunction = async (request, _reply) => {
  const { webhookKey } = request.query as { webhookKey: string | undefined };
  if (!webhookKey) {
    throw Boom.forbidden("Clé manquante");
  }

  if (config.smtp.webhookKey !== webhookKey) {
    throw Boom.forbidden("Non autorisé");
  }
};

export function getUserFromRequest(request: FastifyRequest): IUser {
  if (!request.user) {
    throw Boom.forbidden();
  }

  return request.user;
}
