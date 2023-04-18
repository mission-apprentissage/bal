import { FromSchema } from "json-schema-to-ts";

const collectionName = "sessions";

const indexes = () => {
  return [];
};

export const SSession = {
  type: "object",
  properties: {
    _id: { type: "string" },
    token: { type: "string" },
  },
  required: ["token"],
} as const;

export interface ISession extends FromSchema<typeof SSession> {}

export default { schema: SSession, indexes, collectionName };
