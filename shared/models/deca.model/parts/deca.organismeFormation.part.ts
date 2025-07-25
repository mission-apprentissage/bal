import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

export const ZDecaOrganismeFormation = z.object({
  siret: z.optional(z.string()),
  uai_cfa: z.optional(z.string()),
});

export type IDecaOrganismeFormation = z.output<typeof ZDecaOrganismeFormation>;
export type IDecaOrganismeFormationJson = Jsonify<z.input<typeof ZDecaOrganismeFormation>>;
