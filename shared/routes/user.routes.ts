import { FromSchema } from "json-schema-to-ts";

import { IUser, SUser } from "../models/user.model";

export const SReqPostUser = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["name"],
} as const;

export type IReqPostUser = FromSchema<typeof SReqPostUser>;


export const SResPostUser = SUser;
export interface IResPostUser extends IUser {}
