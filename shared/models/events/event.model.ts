import { ObjectId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor } from "../common";
import { ZBalEmailsPayload } from "./bal_emails.event";

const collectionName = "events" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ person_id: 1 }, {}],
  [{ "payload.emails.token": 1 }, {}],
  [{ name: 1 }, {}],
];

export const ZEvent = () =>
  z.object({
    _id: z.instanceof(ObjectId).describe("Identifiant de l'évènement"),
    person_id: z.string().describe("Identifiant de la personne"),
    name: z.string().describe("Nom de l'évènement"),
    payload: z.array(ZBalEmailsPayload()).describe("Payload de l'évènement"),
  });

export const SEvent = zodToJsonSchema(ZEvent());

export type IEvent = z.input<ReturnType<typeof ZEvent>>;

export default {
  schema: SEvent as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
