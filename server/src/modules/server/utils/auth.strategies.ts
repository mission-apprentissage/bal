import { FastifyAuthFunction } from "@fastify/auth";
import { JwtPayload, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";

import { config } from "../../../../config/config";
import { findUser } from "../../actions/users.actions";

declare module "fastify" {
  export interface FastifyRequest {
    authenticatedUser?: IUser;
  }
}

// ne pas utiliser done() pour les fonctions async

export const authValidateJWT: FastifyAuthFunction = async (request, _reply) => {
  let token: string | undefined = request.raw.headers["authorization"];
  if (!token) {
    throw new Error("Jeton manquant");
  }

  if (token.startsWith("Bearer ")) {
    token = token.substring(7, token.length);
  } else {
    throw new Error("Jeton invalide");
  }

  try {
    const decoded = verify(token, config.auth.user.jwtSecret) as JwtPayload;

    const user = await findUser({ _id: new ObjectId(decoded.id) });

    if (user) {
      request.authenticatedUser = user;
    }
  } catch (error) {
    throw new Error("Jeton invalide");
  }
};

export const authValidateSession: FastifyAuthFunction = async (
  request,
  _reply
) => {
  if (!request.session) {
    throw new Error("Session manquante");
  }

  const userId = request.session.get("userId");

  if (!userId) {
    throw new Error("Session invalide");
  }

  try {
    const user = await findUser({
      _id: new ObjectId(userId),
    });

    if (user) {
      request.authenticatedUser = user;
    }
  } catch (error) {
    throw new Error("Session invalide");
  }
};
