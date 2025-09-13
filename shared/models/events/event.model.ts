import { z } from "zod/v4-mini";
import type { IModelDescriptor } from "../common";
import { ZEventBalEmail } from "./bal_emails.event";

const collectionName = "events" as const;

const indexes: IModelDescriptor["indexes"] = [[{ type: 1, messageId: 1 }, {}]];

const ZEvent = z.discriminatedUnion("type", [ZEventBalEmail]);

export type IEvent = z.output<typeof ZEvent>;

export default {
  zod: ZEvent,
  indexes,
  collectionName,
};
