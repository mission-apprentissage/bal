import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

export const ZDecaFormation = z.object({
  date_debut_formation: z.optional(z.date()),
  date_fin_formation: z.optional(z.date()),
  code_diplome: z.optional(z.string()),
  intitule_ou_qualification: z.optional(z.string()),
  rncp: z.optional(z.string()),
  type_diplome: z.optional(z.string()),
});

export type IDecaFormation = z.output<typeof ZDecaFormation>;
export type IDecaFormationJson = Jsonify<z.input<typeof ZDecaFormation>>;
