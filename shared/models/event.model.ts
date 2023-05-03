import { FromSchema } from "json-schema-to-ts";

const collectionName = "events";

const indexes = () => {
  return [];
};

export const SEvent = {
  type: "object",
  properties: {
    _id: { type: "string" },
    type: { type: "string", enum: ["email"] },
    payload: {
      type: "object",
      additionalProperties: true,
    },
  },
} as const;

export interface IEvent extends FromSchema<typeof SEvent> {}

export default { schema: SEvent, indexes, collectionName };
