import { z } from "zod/v4-mini";
import type { IModelDescriptor } from "../common";
import { zObjectId } from "../common";

const collectionName = "lba.mailingLists" as const;

export const enum EmailStatus {
  VALID = "valid",
  INVALID = "invalid",
  UNVERIFIED = "unverified",
}

const ZCampagne = z.object({
  name: z.string(),
  sentAt: z.coerce.date(),
  listId: z.string(),
});

export const ZLbaMailingContact = z.object({
  email: z.email(),
  siren: z.string(),
  Resultat_net: z.number(),
  siret: z.string(),
  trancheEffectifsEtablissement: z.string(),
  codePostalEtablissement: z.string(),
  activitePrincipaleEtablissement: z.string(),
  enseigne1Etablissement: z.string(),
  enseigne2Etablissement: z.nullable(z.string()),
  enseigne3Etablissement: z.nullable(z.string()),
  denominationUsuelleEtablissement: z.string(),
  raisonsociale: z.string(),
  exported_at: z.coerce.date(),
  date_cloture_exercice: z.coerce.date(),
});

export type ILbaMailingContact = z.output<typeof ZLbaMailingContact>;

export const ZLbaMailingList = z.extend(ZLbaMailingContact, {
  _id: zObjectId,

  nbAlternants: z.nullable(z.number()),
  nbContrats: z.nullable(z.number()),
  nbSocietesMemeNaf: z.nullable(z.number()),
  campagnes: z.array(ZCampagne),
  emailStatus: z.enum([EmailStatus.VALID, EmailStatus.INVALID, EmailStatus.UNVERIFIED]),

  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type ILbaMailingList = z.output<typeof ZLbaMailingList>;

export default {
  zod: ZLbaMailingList,
  indexes: [
    [{ email: 1 }, { unique: true }],
    [{ siret: 1 }, { unique: true }],
  ],
  collectionName,
} as const satisfies IModelDescriptor;
