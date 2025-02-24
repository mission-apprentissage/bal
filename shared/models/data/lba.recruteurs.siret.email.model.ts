import { z } from "zod";

import { IModelDescriptor, zObjectId } from "../common";

const collectionName = "lba.recruteurs.siret.email" as const;

export const ZLbaRecruteursSiretEmail = z
  .object({
    _id: zObjectId,
    siret: z.string().describe("Le Siret de la société"),
    email: z.string().describe("Adresse email de contact"),
    created_at: z.date().describe("La date création de la demande"),
    updated_at: z.date().describe("Date de dernières mise à jour"),
  })
  .strict();

export type ILbaRecruteursSiretEmail = z.output<typeof ZLbaRecruteursSiretEmail>;

export default {
  zod: ZLbaRecruteursSiretEmail,
  indexes: [[{ siret: 1, email: 1 }, {}]],
  collectionName,
} as const satisfies IModelDescriptor;
