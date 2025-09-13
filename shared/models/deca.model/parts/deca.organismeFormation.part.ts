import { z } from "zod/v4-mini";

export const ZDecaOrganismeFormation = z.object({
  siret: z.optional(z.string()),
  uai_cfa: z.optional(z.string()),
});
