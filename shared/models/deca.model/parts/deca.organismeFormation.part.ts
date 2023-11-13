import { Jsonify } from "type-fest";
import { z } from "zod";

export const ZDecaOrganismeFormation = z
  .object({
    siret: z.string().optional().describe("Le SIRET de l'organisme de formation principal"),
    uai_cfa: z.string().optional().describe("L'UAI de l'organisme responsable"),
  })
  .strict();

export type IDecaOrganismeFormation = z.output<typeof ZDecaOrganismeFormation>;
export type IDecaOrganismeFormationJson = Jsonify<z.input<typeof ZDecaOrganismeFormation>>;
