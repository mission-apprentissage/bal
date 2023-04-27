import { FromSchema } from "json-schema-to-ts";

import { SResGetUser } from "./user.routes";

/**
 * Session
 */
export const SResGetSession = SResGetUser;

export type IResGetSession = FromSchema<typeof SResGetSession> & {
  error: string;
};

/**
 * Login
 */
export const SReqPostLogin = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
  },
  required: ["email", "password"],
} as const;

export type IReqPostLogin = FromSchema<typeof SReqPostLogin>;

export const SResPostLogin = SResGetSession;
export type IResPostLogin = FromSchema<typeof SResPostLogin>;

/**
 * Reset password
 */
export const SReqGetResetPassword = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
} as const;

export type IReqGetResetPassword = FromSchema<typeof SReqGetResetPassword>;

export const SReqPostResetPassword = {
  type: "object",
  properties: {
    password: { type: "string" },
    token: { type: "string" },
  },
  required: ["password", "token"],
} as const;

export type IReqPostResetPassword = FromSchema<typeof SReqPostResetPassword>;
