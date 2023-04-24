import { FromSchema } from "json-schema-to-ts";

const collectionName = "users";

const indexes = () => {
  return [[{ email: 1 }, { unique: true }]];
};

export const SUser = {
  type: "object",
  properties: {
    _id: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
    is_admin: { type: "boolean" },
    api_key: { type: "string" },
  },
  required: ["_id", "email", "password"],
} as const;

export interface IUser extends FromSchema<typeof SUser> {}

export default { schema: SUser, indexes, collectionName };
