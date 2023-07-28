import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "../common";
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

export type IEvent = z.output<typeof ZEvent>;
export type IEventJson = Jsonify<z.output<typeof ZEvent>>;

export default {
  zod: ZEvent,
  indexes,
  collectionName,
};
