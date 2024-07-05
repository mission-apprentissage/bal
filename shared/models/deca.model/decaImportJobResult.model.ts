import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "../common";

const collectionName = "decaimportjobresult" as const;

const indexes: IModelDescriptor["indexes"] = [[{ import_date: 1 }, {}]];

export const ZDecaImportJobResult = z
  .object({
    _id: zObjectId,
    import_date: z.string().describe("La date d'un import deca au format yyyy-MM-dd"),
    has_completed: z
      .boolean()
      .describe(
        "true marque que l'import pour ce jour précis est complet. informatif uniquement. false ne sera jamais enregistré"
      ),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export type IDecaImportJobResult = z.output<typeof ZDecaImportJobResult>;
export type IDecaImportJobResultJson = Jsonify<z.input<typeof ZDecaImportJobResult>>;

export default {
  zod: ZDecaImportJobResult,
  indexes,
  collectionName,
};
