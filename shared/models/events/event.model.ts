import type { Jsonify } from "type-fest";
import { z } from "zod";

import type { IModelDescriptor } from "../common";
import { ZEventBalEmail } from "./bal_emails.event";

const collectionName = "events" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ person_id: 1 }, {}],
  [{ type: 1, messageId: 1 }, {}],
];

export const ZEvent = z.discriminatedUnion("type", [ZEventBalEmail]);

export type IEvent = z.output<typeof ZEvent>;
export type IEventJson = Jsonify<z.output<typeof ZEvent>>;

export default {
  zod: ZEvent,
  indexes,
  collectionName,
};
