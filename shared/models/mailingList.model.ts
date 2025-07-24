import type { Jsonify } from "type-fest";
import { z } from "zod";

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
        simple: z.boolean(),
      })
    )
    .describe("Liste des colonnes de sortie"),
  training_columns: z
    .object({
      cle_ministere_educatif: z.string().optional(),
      mef: z.string().optional(),
      cfd: z.string().optional(),
      rncp: z.string().optional(),
      code_postal: z.string().optional(),
      uai_lieu_formation: z.string().optional(),
      uai_formateur: z.string().optional(),
      uai_formateur_responsable: z.string().optional(),
      code_insee: z.string().optional(),
    })

    .describe("Liste des colonnes lié à la formation"),
  document_id: z.string().optional().describe("Identifiant du document généré"),
  added_by: z.string().describe("L'utilisateur ayant crée la liste"),
  updated_at: z.date().describe("Date de mise à jour en base de données"),
  created_at: z.date().describe("Date d'ajout en base de données"),
});

export const ZMailingListWithDocumenAndOwner = ZMailingList.extend({
  document: ZMailingListDocument.nullish(),
  owner: ZUserPublic.nullish(),
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
