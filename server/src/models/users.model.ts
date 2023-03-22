import { FromSchema } from "json-schema-to-ts";

const collectionName = "users";

const indexes = () => {
  return [[{ name: 1 }, { name: "name" }]];
};

const schema = {
  type: "object",
  properties: {
    name: { type: "string" },
  },
  required: ["name"],
} as const;

export type User = FromSchema<typeof schema>;

export default { schema, indexes, collectionName };
