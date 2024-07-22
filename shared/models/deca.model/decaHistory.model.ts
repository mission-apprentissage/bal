import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "../common";

const collectionName = "decaHistory" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const ZDecaHistory = z
  .object({
    _id: zObjectId,
    key: z.string().describe("Modified key"),
    from: z.any().describe("Value from"),
    to: z.any().describe("Value to"),
    deca_id: zObjectId,
    time: z.date().describe("Modified time"),
  })
  ;

export type IDecaHistory = z.output<typeof ZDecaHistory>;
export type IDecaHistoryJson = Jsonify<z.input<typeof ZDecaHistory>>;

export default {
  zod: ZDecaHistory,
  indexes,
  collectionName,
};
