import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "../..";
import { IModelDescriptor } from "../common";
import { SBalEmailsPayload } from "./bal_emails.event";

const collectionName = "events";

const indexes: IModelDescriptor["indexes"] = [
  [{ person_id: 1 }, {}],
  [{ "payload.emails.token": 1 }, {}],
  [{ name: 1 }, {}],
];

export const SEvent = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    person_id: { type: "string" },
    name: { type: "string", enum: ["bal_emails"] },
    payload: {
      anyOf: [SBalEmailsPayload],
    },
  },
  required: ["person_id", "name", "payload"],
} as const;

export interface IEvent
  extends FromSchema<typeof SEvent, { deserialize: deserialize }> {}

export default { schema: SEvent, indexes, collectionName };
