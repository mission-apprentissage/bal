import { FromSchema } from "json-schema-to-ts";

import { SBalEmailsPayload } from "./bal_emails.event";

const collectionName = "events";

const indexes = () => {
  return [[{ person_id: 1 }], [{ "payload.emails.token": 1 }, {}]];
};

export const SEvent = {
  type: "object",
  properties: {
    _id: { type: "string" },
    person_id: { type: "string" },
    type: { type: "string", enum: ["bal_emails"] },
    payload: {
      anyOf: [SBalEmailsPayload],
    },
  },
} as const;

export interface IEvent extends FromSchema<typeof SEvent> {}

export default { schema: SEvent, indexes, collectionName };
