import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

export const ZDecaEmployeur = z.object({
  siret: z.optional(z.string()),
  denomination: z.optional(z.string()),
  adresse: z.optional(
    z.object({
      code_postal: z.string(),
    })
  ),
  naf: z.optional(z.string()),
  code_idcc: z.optional(z.string()),
  nombre_de_salaries: z.nullish(z.number()),
  courriel: z.optional(z.string()),
  telephone: z.optional(z.string()),
});

export type IDecaEmployeur = z.output<typeof ZDecaEmployeur>;
export type IDecaEmployeurJson = Jsonify<z.input<typeof ZDecaEmployeur>>;
