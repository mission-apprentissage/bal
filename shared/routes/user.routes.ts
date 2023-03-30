import { FromSchema } from "json-schema-to-ts";

import { IUser, SUser } from "../models/user.model";

export const SReqPostUser = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
  },
  required: ["email"],
} as const;

export type IReqPostUser = FromSchema<typeof SReqPostUser>;

export const SResGetUser = SUser;
export const SResPostUser = SUser;

export interface IResGetUser extends IUser {}
export interface IResPostUser extends IUser {}

export const SReqHeadersUser = {
  type: "object",
  properties: {
    Authorization: { type: "string" },
  },
  required: ["Authorization"],
};
