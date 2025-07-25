import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "documentContents" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ document_id: 1 }, { name: "document_id" }],
  [{ type_document: 1, _id: 1 }, {}],
  [{ document_id: 1, "content.email": 1 }, { partialFilterExpression: { "content.email": { $exists: true } } }],
];

export const ZDocumentContent = z.object({
  _id: zObjectId,
  document_id: z.string(),
  content: z.optional(z.record(z.string(), z.unknown())),
  type_document: z.optional(z.string()),
  updated_at: z.optional(z.date()),
  created_at: z.optional(z.date()),
});

export type IDocumentContent = z.output<typeof ZDocumentContent>;
export type IDocumentContentJson = Jsonify<z.input<typeof ZDocumentContent>>;

export default {
  zod: ZDocumentContent,
  indexes,
  collectionName,
};
