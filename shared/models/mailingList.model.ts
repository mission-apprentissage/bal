import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";
import { ZMailingListDocument } from "./document.model";
import { ZUserPublic } from "./user.model";

const collectionName = "mailingLists" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ campaign_name: 1 }, { name: "campaign_name" }],
  [{ source: 1 }, { name: "source" }],
];

export const ZMailingList = z.object({
  _id: zObjectId,
  campaign_name: z.string(),
  source: z.string(),
  email: z.string(),
  secondary_email: z.optional(z.string()),
  identifier_columns: z.array(z.string()),
  output_columns: z.array(
    z.object({
      column: z.string(),
      output: z.string(),
      simple: z.boolean(),
    })
  ),
  training_columns: z.object({
    cle_ministere_educatif: z.optional(z.string()),
    mef: z.optional(z.string()),
    cfd: z.optional(z.string()),
    rncp: z.optional(z.string()),
    code_postal: z.optional(z.string()),
    uai_lieu_formation: z.optional(z.string()),
    uai_formateur: z.optional(z.string()),
    uai_formateur_responsable: z.optional(z.string()),
    code_insee: z.optional(z.string()),
  }),
  document_id: z.optional(z.string()),
  added_by: z.string(),
  updated_at: z.date(),
  created_at: z.date(),
});

export const ZMailingListWithDocumenAndOwner = z.object({
  ...ZMailingList.shape,
  document: z.nullish(ZMailingListDocument),
  owner: z.nullish(ZUserPublic),
});

export type IMailingList = z.output<typeof ZMailingList>;
export type IMailingListJson = Jsonify<z.input<typeof ZMailingList>>;

export type IMailingListWithDocumentAndOwner = z.output<typeof ZMailingListWithDocumenAndOwner>;
export type IMailingListWithDocumentAndOwnerJson = Jsonify<z.input<typeof ZMailingListWithDocumenAndOwner>>;

export default {
  zod: ZMailingList,
  indexes,
  collectionName,
};
