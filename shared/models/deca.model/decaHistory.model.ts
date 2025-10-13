import { z } from "zod/v4-mini";
import type { IModelDescriptor } from "../common";
import { zObjectId } from "../common";

const collectionName = "decaHistory" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ deca_id: 1, time: -1 }, {}],
  [{ time: -1 }, {}],
];

const ZDecaHistory = z.object({
  _id: zObjectId,
  key: z.string(),
  from: z.optional(z.any()),
  to: z.optional(z.any()),
  deca_id: zObjectId,
  time: z.date(),
});

export type IDecaHistory = z.output<typeof ZDecaHistory>;

export default {
  zod: ZDecaHistory,
  indexes,
  collectionName,
};
