import { Jsonify } from "type-fest";
import { z } from "zod";

export const ZDecaEmployeur = z
  .object({
    siret: z.string().optional().describe("N° SIRET de l'employeur"),
    denomination: z.string().optional().describe("Denomination de l'employeur"),
    adresse: z
      .object({
        code_postal: z.string().describe("Le code postal de l'adresse"),
      })
      .strict()
      .optional(),
    naf: z.string().optional().describe("Code NAF de l’entreprise"),
    code_idcc: z.string().optional().describe("Le code IDCC de l'employeur"),
    nombre_de_salaries: z.number().optional().describe("Effectif salarié de l'entreprise"),
    courriel: z.string().optional().describe("Email de l’employeur"),
    telephone: z.string().optional().describe("Téléphone de l'employeur"),
  })
  .strict();

export type IDecaEmployeur = z.output<typeof ZDecaEmployeur>;
export type IDecaEmployeurJson = Jsonify<z.input<typeof ZDecaEmployeur>>;
