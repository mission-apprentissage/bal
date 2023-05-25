import { FromSchema } from "json-schema-to-ts";

import { SPerson } from "../models/person.model";

export const SReqPostUser = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
    organisation_id: { type: "string" },
  },
  required: ["email", "password", "organisation_id"],
} as const;

export type IReqPostUser = FromSchema<typeof SReqPostUser>;

export const SResGetUser = {
  type: "object",
  properties: {
    _id: { type: "string" },
    email: { type: "string" },
    is_admin: { type: "boolean" },
    api_key_used_at: { type: "string", format: "date-time" },
    person: SPerson,
  },
  required: ["email"],
  additionalProperties: false,
} as const;

export const SResPostUser = SResGetUser;

export type IResGetUser = FromSchema<typeof SResGetUser>;
export type IResPostUser = FromSchema<typeof SResPostUser>;

export const SResGetUsers = {
  type: "array",
  items: SResGetUser,
} as const;

export type IResGetUsers = FromSchema<typeof SResGetUsers>;

export const SResGetGenerateApiKey = {
  type: "object",
  properties: {
    api_key: { type: "string" },
  },
  required: ["api_key"],
  additionalProperties: false,
} as const;

export type IResGetGenerateApiKey = FromSchema<typeof SResGetGenerateApiKey>;
