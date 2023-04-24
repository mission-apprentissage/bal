import { FromSchema } from "json-schema-to-ts";

export const SReqPostUser = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["email", "password"],
} as const;

export type IReqPostUser = FromSchema<typeof SReqPostUser>;

export const SResGetUser = {
  type: "object",
  properties: {
    _id: { type: "string" },
    email: { type: "string" },
    is_admin: { type: "boolean" },
  },
  required: ["email"],
  additionalProperties: false,
} as const;

export const SResPostUser = SResGetUser;

export type IResGetUser = FromSchema<typeof SResGetUser>;
export type IResPostUser = FromSchema<typeof SResPostUser>;

export const SReqHeadersUser = {
  type: "object",
  properties: {
    Authorization: { type: "string" },
  },
};

export const SResGetGenerateApiKey = {
  type: "object",
  properties: {
    api_key: { type: "string" },
  },
  required: ["api_key"],
  additionalProperties: false,
} as const;

export type IResGetGenerateApiKey = FromSchema<typeof SResGetGenerateApiKey>;
