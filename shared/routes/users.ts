import { FromSchema } from "json-schema-to-ts";

export const createUserSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    email: { type: "string", format: "email" },
  },
  required: ["name"],
} as const;

export type CreateUser = FromSchema<typeof createUserSchema>;
