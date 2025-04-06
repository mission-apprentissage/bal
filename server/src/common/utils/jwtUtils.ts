import jwt, { SignOptions } from "jsonwebtoken";
import { zRoutes } from "shared";
import { ITemplate, zTemplate } from "shared/mailer";
import { IUserWithPerson } from "shared/models/user.model";

import config from "@/config";

import { generateAccessToken } from "../../security/accessTokenService";

interface ICreateTokenOptions {
  secret?: string;
  expiresIn?: SignOptions["expiresIn"];
  payload?: string | Buffer | object;
}

type TokenType = "user" | "resetPasswordToken" | "activation";

const createToken = (type: TokenType, subject: string | null = null, options: ICreateTokenOptions = {}) => {
  const defaults = config.auth[type];
  const secret = options.secret ?? defaults.jwtSecret;
  const expiresIn = options.expiresIn ?? defaults.expiresIn;
  const payload = options.payload ?? {};

  const opts: SignOptions = {
    issuer: config.appName,
    expiresIn: expiresIn,
  };
  if (subject) {
    opts.subject = subject;
  }
  return jwt.sign(payload, secret, opts);
};

export function createResetPasswordToken(user: IUserWithPerson) {
  return generateAccessToken(user, [
    {
      route: zRoutes.post["/auth/reset-password"],
      resources: {},
    },
  ]);
}

export function serializeEmailTemplate(template: ITemplate): string {
  // We do not set expiry as the result is not used as a token but as serialized data
  return jwt.sign(template, config.auth.user.jwtSecret, {
    issuer: config.appName,
  });
}

export function deserializeEmailTemplate(data: string): ITemplate {
  return zTemplate.parse(jwt.verify(data, config.auth.user.jwtSecret));
}

export function createUserTokenSimple(options = {}) {
  return createToken("user", null, options);
}

export const decodeToken = (token: string, type: TokenType = "user") => {
  return jwt.verify(token, config.auth[type].jwtSecret);
};
