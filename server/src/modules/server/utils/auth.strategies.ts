import { FastifyAuthFunction } from "@fastify/auth";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";

import { config } from "../../../../config/config";
import { decodeToken } from "../../../utils/jwtUtils";
import { getSession } from "../../actions/sessions.actions";
import { findUser } from "../../actions/users.actions";

declare module "fastify" {
  export interface FastifyRequest {
    user?: IUser;
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
    const { id } = decodeToken(token) as JwtPayload;
    const user = await findUser({ _id: new ObjectId(id) });

    if (!user) {
      throw new Error("Jeton invalide");
    }

    request.user = user;
  } catch (error) {
    throw new Error("Jeton invalide");
  }
};

export const authValidateSession: FastifyAuthFunction = async (
  request,
  _reply
) => {
  const token = request.cookies?.[config.session.cookieName];

  if (!token) {
    throw new Error("Session invalide");
  }

  try {
    const session = await getSession({ token });

    if (!session) {
      throw new Error("Session invalide");
    }

    const { email } = decodeToken(token) as JwtPayload;

    const user = await findUser({ email });

    if (!user) {
      throw new Error("Session invalide");
    }

    request.user = user;
  } catch (error) {
    throw new Error("Session invalide");
  }
};
