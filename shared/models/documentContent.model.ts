import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "documentContents" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ document_id: 1 }, { name: "document_id" }],
  [{ type_document: 1 }, { name: "type_document" }],
];

export const ZDocumentContent = z
  .object({
    _id: zObjectId,
    document_id: z.string().describe("Identifiant du document"),
    content: z.record(z.unknown()).optional().describe("Contenu du document"),
    type_document: z
      .string()
      .optional()
      .describe("Le type de document (exemple: DECA, etc..)"),
    updated_at: z
      .date()
      .optional()
      .describe("Date de mise à jour en base de données"),
    created_at: z.date().optional().describe("Date d'ajout en base de données"),
  })
  .strict();

export type IDocumentContent = z.output<typeof ZDocumentContent>;
export type IDocumentContentJson = Jsonify<z.input<typeof ZDocumentContent>>;

export default {
  zod: ZDocumentContent,
  indexes,
  collectionName,
};
