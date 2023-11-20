import { Jsonify } from "type-fest";
import { z } from "zod";

export const ZDecaApprenant = z
  .object({
    nom: z.string().describe("Le nom de l'alternant"),
    prenom: z.string().describe("Le prenom de l'alternant"),
    sexe: z.string().describe("Le sexe de l'alternant"), // Alphanumérique H,   F  (H   par   défaut si   Autre   dans DECA)
    date_naissance: z.date().describe("La date de naissance de l'alternant"), // AAAA-MM-JJ
    departement_naissance: z.string().describe("Le département de naissance de l'alternant"),
    nationalite: z.number().optional().describe("Le code de la nationalité de l'alternant"),
    handicap: z.boolean().optional().describe("Indique si l'alternant est identifié comme porteur d'un handicap"),
    courriel: z.string().optional().describe("L'adresse email de l'alternant"),
    telephone: z.string().optional().describe("Le numéro de téléphone de l'alternant"),
    adresse: z
      .object({
        numero: z.number().optional().describe("Le numéro de l'adresse"),
        voie: z.string().optional().describe("La voie de l'adresse"),
        code_postal: z.string().optional().describe("Le code postal de l'adresse"),
      })
      .strict()
      .optional(),
    derniere_classe: z.string().optional().describe("La dernière classe de l'apprenant"),
  })
  .strict();

export type IDecaApprenant = z.output<typeof ZDecaApprenant>;
export type IDecaApprenantJson = Jsonify<z.input<typeof ZDecaApprenant>>;