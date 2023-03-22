import { FromSchema } from "json-schema-to-ts";

const collectionName = "users";

const indexes = () => {
  return [[{ name: 1 }, { name: "name" }]];
};

export const userSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    email: { type: "string" },
  },
  required: ["name"],
} as const;

export type User = FromSchema<typeof userSchema>;

export default { schema: userSchema, indexes, collectionName };
