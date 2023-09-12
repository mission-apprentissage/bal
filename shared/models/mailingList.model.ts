import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";
import { ZDocument } from "./document.model";

export enum MAILING_LIST_STATUS {
  PROCESSING = "processing",
  DONE = "done",
  ERROR = "error",
}

const collectionName = "mailingLists" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ campaign_name: 1 }, { name: "campaign_name" }],
  [{ source: 1 }, { name: "source" }],
];

export const ZMailingList = z
  .object({
    _id: zObjectId,
    status: z.enum([MAILING_LIST_STATUS.PROCESSING, MAILING_LIST_STATUS.DONE, MAILING_LIST_STATUS.ERROR]).optional(),
    campaign_name: z.string().describe("Nom de la campagne"),
    source: z.string().describe("Source de la campagne"),
    email: z.string().describe("Nom de la colonne email"),
    secondary_email: z.string().optional().describe("Nom de la colonne email secondaire"),
    identifier_columns: z.array(z.string()).describe("Liste des colonnes d'identifiants"),
    output_columns: z
      .array(
        z.object({
          column: z.string(),
          output: z.string(),
          grouped: z.boolean(),
        })
      )
      .describe("Liste des colonnes de sortie"),
    document_id: z.string().optional().describe("Identifiant du document généré"),
    added_by: z.string().describe("L'utilisateur ayant crée la liste"),
    updated_at: z.date().describe("Date de mise à jour en base de données").optional(),
    created_at: z.date().describe("Date d'ajout en base de données").optional(),
  })
  .strict();

export const ZMailingListWithDocument = ZMailingList.extend({
  document: ZDocument.nullish(),
}).strict();

export type IMailingList = z.output<typeof ZMailingList>;
export type IMailingListJson = Jsonify<z.input<typeof ZMailingList>>;

export type MailingListWithDocument = z.output<typeof ZMailingListWithDocument>;
export type MailingListWithDocumentJson = Jsonify<z.input<typeof ZMailingListWithDocument>>;

export default {
  zod: ZMailingList,
  indexes,
  collectionName,
};
