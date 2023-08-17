import jwt, { SignOptions } from "jsonwebtoken";

import config from "@/config";

interface ICreateUserToken {
  _id: string;
  email: string;
  is_admin?: boolean;
}
interface ICreateTokenOptions {
  secret?: string;
  expiresIn?: string;
  payload?: string | Buffer | object;
}

type TokenType = "user" | "resetPasswordToken" | "activation";

const createToken = (
  type: TokenType,
  subject: string | null = null,
  options: ICreateTokenOptions = {}
) => {
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

export function createResetPasswordToken(
  username: string,
  options: ICreateTokenOptions = {}
) {
  return createToken("resetPasswordToken", username, options);
}

export function createActivationToken(
  subject: string,
  options: ICreateTokenOptions = {}
) {
  return createToken("activation", subject, options);
}

export function createUserTokenSimple(options = {}) {
  return createToken("user", null, options);
}

export const createUserToken = (
  user: ICreateUserToken,
  options: ICreateTokenOptions = {}
) => {
  const payload = {
    id: user._id,
    is_admin: user.is_admin,
  };
  return createToken("user", user.email, { payload, ...options });
};

export const decodeToken = (token: string, type: TokenType = "user") => {
  return jwt.verify(token, config.auth[type].jwtSecret);
};
