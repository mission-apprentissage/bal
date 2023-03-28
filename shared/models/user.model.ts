import { FromSchema } from "json-schema-to-ts";

const collectionName = "users";

const indexes = () => {
  return [[{ name: 1 }, { name: "name" }]];
};

export const SUser = {
  type: "object",
  properties: {
    _id: { type: "string" },
    email: { type: "string" },
    token: { type: "string" },
  },
  required: ["email"],
} as const;

export type IUser = FromSchema<typeof SUser>;

export default { schema: SUser, indexes, collectionName };
