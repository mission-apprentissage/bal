import { ObjectId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { ZPerson } from "../models/person.model";

/**
 * Session
 */

export const ZReqGetSession = () =>
  z
    .object({
      _id: z.instanceof(ObjectId),
      email: z.string().email(),
      is_admin: z.boolean().optional(),
      api_key_used_at: z.date().optional(),
      person: ZPerson().optional(),
    })
    .strict();

export const SResGetSession = zodToJsonSchema(ZReqGetSession());

export type IResGetSession = z.input<ReturnType<typeof ZReqGetSession>> & {
  error?: string;
};

/**
 * Login
 */

export const ZReqPostLogin = () =>
  z
    .object({
      email: z.string().email(),
      password: z.string(),
    })
    .strict();

export const SReqPostLogin = zodToJsonSchema(ZReqPostLogin());
export type IReqPostLogin = z.input<ReturnType<typeof ZReqPostLogin>>;

export const SResPostLogin = SResGetSession;
export type IResPostLogin = z.input<ReturnType<typeof ZReqGetSession>>;

/**
 * Reset password
 */
export const ZReqGetResetPassword = () =>
  z.object({ email: z.string().email() }).strict();

export const SReqGetResetPassword = zodToJsonSchema(ZReqGetResetPassword());
export type IReqGetResetPassword = z.input<
  ReturnType<typeof ZReqGetResetPassword>
>;

export const ZReqPostResetPassword = () =>
  z
    .object({
      password: z.string(),
      token: z.string(),
    })
    .strict();

export const SReqPostResetPassword = zodToJsonSchema(ZReqPostResetPassword());

export type IReqPostResetPassword = z.input<
  ReturnType<typeof ZReqPostResetPassword>
>;
export interface IStatus {
  error?: boolean;
  message?: string;
}
