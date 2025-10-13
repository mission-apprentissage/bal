import { z } from "zod/v4-mini";

export const ZDecaApprenant = z.object({
  nom: z.string(),
  prenom: z.optional(z.string()),
  sexe: z.nullish(z.string()),
  date_naissance: z.date(),
  departement_naissance: z.optional(z.string()),
  nationalite: z.optional(z.number()),
  handicap: z.optional(z.boolean()),
  courriel: z.optional(z.string()),
  telephone: z.optional(z.string()),
  adresse: z.optional(
    z.object({
      numero: z.nullish(z.coerce.string()),
      voie: z.optional(z.string()),
      code_postal: z.optional(z.string()),
    })
  ),
  derniere_classe: z.nullish(z.coerce.number()),
});
