import { WithId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor, toJsonSchemaOptions, zObjectId } from "../common";
import { ZBalEmailsPayload } from "./bal_emails.event";

const collectionName = "events" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ person_id: 1 }, {}],
  [{ "payload.emails.token": 1 }, {}],
  [{ name: 1 }, {}],
];

export const ZEvent = z
  .object({
    _id: zObjectId,
    person_id: z.string().describe("Identifiant de la personne"),
    name: z.enum(["bal_emails"]).describe("Nom de l'évènement"),
    payload: ZBalEmailsPayload.describe("Payload de l'évènement"),
  })
  .nonstrict();

export const SEvent = zodToJsonSchema(ZEvent, toJsonSchemaOptions);

export type IEvent = z.input<typeof ZEvent>;
export type IEventDocument = WithId<Omit<IEvent, "_id">>;

export default {
  schema: SEvent as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
