import type { Jsonify } from "type-fest";
import { z } from "zod";

export const ZDecaApprenant = z.object({
  nom: z.string().describe("Le nom de l'alternant"),
  prenom: z.string().optional().describe("Le prenom de l'alternant"),
  sexe: z.string().nullish().describe("Le sexe de l'alternant"),
  date_naissance: z.date().describe("La date de naissance de l'alternant"), // AAAA-MM-JJ
  departement_naissance: z.string().optional().describe("Le département de naissance de l'alternant"),
  nationalite: z.number().optional().describe("Le code de la nationalité de l'alternant"),
  handicap: z.boolean().optional().describe("Indique si l'alternant est identifié comme porteur d'un handicap"),
  courriel: z.string().optional().describe("L'adresse email de l'alternant"),
  telephone: z.string().optional().describe("Le numéro de téléphone de l'alternant"),
  adresse: z
    .object({
      numero: z.coerce.string().nullish().describe("Le numéro de l'adresse"),
      voie: z.string().optional().describe("La voie de l'adresse"),
      code_postal: z.string().optional().describe("Le code postal de l'adresse"),
    })

    .optional(),
  derniere_classe: z.coerce.number().nullish().describe("La dernière classe de l'apprenant"),
});

export type IDecaApprenant = z.output<typeof ZDecaApprenant>;
export type IDecaApprenantJson = Jsonify<z.input<typeof ZDecaApprenant>>;
