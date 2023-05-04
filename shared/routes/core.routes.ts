import { FromSchema } from "json-schema-to-ts";

export const SResGetHealthCheck = {
  type: "object",
  properties: {
    name: { type: "string" },
    version: { type: "string" },
    env: { type: "string" },
  },
  required: ["name", "version", "env"],
  additionalProperties: false,
} as const;

export type IResGetHealthCheck = FromSchema<typeof SResGetHealthCheck>;
