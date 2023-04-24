import { FromSchema } from "json-schema-to-ts";

const collectionName = "documentContents";

const indexes = () => {
  return [[{ document_id: 1 }, { document_id: "document_id" }]];
};

export const SDocumentContent = {
  type: "object",
  properties: {
    _id: { type: "string" },
    document_id: { type: "string" },
    content_line: {
      type: "object",
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
} as const;

export interface IDocumentContent extends FromSchema<typeof SDocumentContent> {}

export default { schema: SDocumentContent, indexes, collectionName };
