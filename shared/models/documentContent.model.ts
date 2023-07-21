import { WithId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor, toJsonSchemaOptions, zObjectId } from "./common";

const collectionName = "documentContents" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ document_id: 1 }, { name: "document_id" }],
  [{ type_document: 1 }, { name: "type_document" }],
];

export const ZDocumentContent = z
  .object({
    _id: zObjectId,
    document_id: z.string().describe("Identifiant du document"),
    content: z.record(z.any()).optional().describe("Contenu du document"),
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

export const SDocumentContent = zodToJsonSchema(
  ZDocumentContent,
  toJsonSchemaOptions
);

export type IDocumentContent = z.input<typeof ZDocumentContent>;
export type IDocumentContentDocument = WithId<Omit<IDocumentContent, "_id">>;

export default {
  schema: SDocumentContent as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
