import { Jsonify } from "type-fest";
import { z } from "zod";

export const ZDecaFormation = z
  .object({
    date_debut_formation: z.date().optional().describe("La date de début de la formation"), // AAAA-MM-JJ
    date_fin_formation: z.date().optional().describe("La date de fin de la formation"), // AAAA-MM-JJ
    code_diplome: z.string().optional().describe("Le code diplôme de la formation"),
    intitule_ou_qualification: z.string().optional().describe("L'adresse email de l'alternant"),
    rncp: z.string().optional().describe("Le code RNCP de la formation"),
    type_diplome: z.string().optional().describe("Catégorie par niveau du Diplôme ou titre visé par l'Alternant"),
  })
  .strict();

export type IDecaFormation = z.output<typeof ZDecaFormation>;
export type IDecaFormationJson = Jsonify<z.input<typeof ZDecaFormation>>;
