import type { IModelDescriptor } from "../common";
import { ZDecaImportJobResult } from "./decaImportJobResult.model";

const collectionName = "deca.import.job.result.specific" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ import_date_string: 1 }, {}],
  [{ import_date: -1 }, {}],
];

export default {
  zod: ZDecaImportJobResult,
  indexes,
  collectionName,
};
