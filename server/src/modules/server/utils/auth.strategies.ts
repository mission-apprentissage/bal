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

export const authValidateJWT: FastifyAuthFunction = async (
  request,
  _reply,
  done
) => {
  if (!request.raw.headers["access-token"]) {
    return done(new Error("Jeton manquant"));
  }

  try {
    const decoded = verify(
      request.raw.headers["access-token"] as string,
      config.auth.user.jwtSecret
    ) as JwtPayload;

    const user = await findUser({ _id: new ObjectId(decoded.id) });

    if (user) {
      request.authenticatedUser = user;
    }

    return done();
  } catch (error) {
    return done(new Error("Jeton invalide"));
  }
};
