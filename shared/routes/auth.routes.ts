import { FromSchema } from "json-schema-to-ts";

import { IUser, SUser } from "../models/user.model";

export const SReqPostLogin = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", format: "password" },
  },
  required: ["email", "password"],
} as const;

export type IReqPostLogin = FromSchema<typeof SReqPostLogin>;

export const SResPostLogin = SUser;

export interface IResPostLogin extends IUser {}
