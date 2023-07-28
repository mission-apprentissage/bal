import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "documents" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const ZDocument = z
  .object({
    _id: zObjectId,
    type_document: z
      .string()
      .describe("Le type de document (exemple: DECA, etc..)"),
    ext_fichier: z
      .enum(["xlsx", "xls", "csv"])
      .describe("Le type de fichier extension"),
    nom_fichier: z.string().describe("Le nom de fichier"),
    chemin_fichier: z.string().describe("Chemin du fichier binaire"),
    taille_fichier: z
      .number()
      .int()
      .finite()
      .describe("Taille du fichier en bytes"),
    hash_secret: z.string().describe("Hash fichier"),
    hash_fichier: z.string().describe("Checksum fichier"),
    import_progress: z
      .number()
      .finite()
      .optional()
      .describe("Progress percentage (-1 not started)"),
    lines_count: z
      .number()
      .int()
      .finite()
      .optional()
      .describe("Number of lines"),
    added_by: z.string().describe("Qui a ajouté le fichier"),
    updated_at: z
      .date()
      .optional()
      .describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export const zDocumentPublic = ZDocument.omit({
  hash_fichier: true,
  hash_secret: true,
});

export type IDocument = z.output<typeof ZDocument>;
export type IDocumentJson = Jsonify<z.input<typeof zDocumentPublic>>;

export interface IDocumentWithContent<TContent> extends IDocument {
  content: TContent;
}

export default {
  zod: ZDocument,
  indexes,
  collectionName,
};
