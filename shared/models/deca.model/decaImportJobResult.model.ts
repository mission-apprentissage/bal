import { z } from "zod/v4-mini";
import type { IModelDescriptor } from "../common";
import { zObjectId } from "../common";

const collectionName = "deca.import.job.result" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ import_date_string: 1 }, {}],
  [{ import_date: -1 }, {}],
];

const ZDecaImportJobResult = z.object({
  _id: zObjectId,
  // La date d'un import deca au format yyyy-MM-dd"
  import_date_string: z.string(),
  // La date d'un import deca au format date tz Paris
  import_date: z.date(),
  // true marque que l'import pour ce jour précis est complet. informatif uniquement. false ne sera jamais enregistré
  has_completed: z.boolean(),
  created_at: z.date(),
});

export type IDecaImportJobResult = z.output<typeof ZDecaImportJobResult>;

export default {
  zod: ZDecaImportJobResult,
  indexes,
  collectionName,
};
