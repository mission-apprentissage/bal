import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { zObjectId } from "../models/common";
import { ZPerson } from "../models/person.model";

/**
 * Session
 */

export const ZReqGetSession = z
  .object({
    _id: zObjectId,
    email: z.string().email(),
    is_admin: z.boolean().optional(),
    api_key_used_at: z.date().optional().nullable(),
    person: ZPerson.optional(),
  })
  .strict();

export const SResGetSession = zodToJsonSchema(ZReqGetSession);

export type IResGetSession = z.input<typeof ZReqGetSession> & {
  error?: string;
};

/**
 * Login
 */

export const ZReqPostLogin = z
  .object({
    email: z.string().email(),
    password: z.string(),
  })
  .strict();

export const SReqPostLogin = zodToJsonSchema(ZReqPostLogin);
export type IReqPostLogin = z.input<typeof ZReqPostLogin>;

export const SResPostLogin = SResGetSession;
export type IResPostLogin = z.input<typeof ZReqGetSession>;

/**
 * Reset password
 */
export const ZReqGetResetPassword = z
  .object({ email: z.string().email() })
  .strict();

export const SReqGetResetPassword = zodToJsonSchema(ZReqGetResetPassword);
export type IReqGetResetPassword = z.input<typeof ZReqGetResetPassword>;

export const ZReqPostResetPassword = z
  .object({
    password: z.string(),
    token: z.string(),
  })
  .strict();

export const SReqPostResetPassword = zodToJsonSchema(ZReqPostResetPassword);

export type IReqPostResetPassword = z.input<typeof ZReqPostResetPassword>;
export interface IStatus {
  error?: boolean;
  message?: string;
}
