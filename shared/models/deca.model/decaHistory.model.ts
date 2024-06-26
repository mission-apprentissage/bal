import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "../common";

const collectionName = "decaHistory" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ key: 1, from: 1, to: 1, deca_id: 1 }, {}],
  [{ "organisme_formation.siret": 1 }, {}],
];

export const ZDecaHistory = z
  .object({
    _id: zObjectId,
    key: z.string().describe("Modified key"),
    from: z.any().describe("Value from"),
    to: z.any().describe("Value to"),
    deca_id: zObjectId,
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
