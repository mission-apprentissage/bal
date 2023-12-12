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
    resumeToken: z
      .object({
        _data: z.string().describe("Resume token"),
      })
      .strict(),
    docId: zObjectId,
    time: z.date().describe("Modified time"),
    created_at: z.date().optional().describe("Date d'ajout en base de données"),
  })
  .strict();

export type IDecaHistory = z.output<typeof ZDecaHistory>;
export type IDecaHistoryJson = Jsonify<z.input<typeof ZDecaHistory>>;

export default {
  zod: ZDecaHistory,
  indexes,
  collectionName,
};
