import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "..";
import { IModelDescriptor } from "./common";

const collectionName = "documentContents" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ document_id: 1 }, { name: "document_id" }],
  [{ type_document: 1 }, { name: "type_document" }],
];

export const SDocumentContent = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    document_id: { type: "string" },
    content: {
      type: "object",
    },
    type_document: {
      type: "string",
      description: "Le type de document (exemple: DECA, etc..)",
    },
    updated_at: {
      type: "string",
      format: "date-time",
      description: "Date de mise à jour en base de données",
    },
    created_at: {
      type: "string",
      format: "date-time",
      description: "Date d'ajout en base de données",
    },
  },
  required: ["_id", "document_id"],
  additionalProperties: false,
} as const;

export interface IDocumentContent
  extends FromSchema<typeof SDocumentContent, { deserialize: deserialize }> {}

export default {
  schema: SDocumentContent as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
