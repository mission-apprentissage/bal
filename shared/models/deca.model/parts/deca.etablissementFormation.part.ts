import { z } from "zod/v4-mini";
import { extensions } from "../../../helpers/zodHelpers/zodPrimitives";

export const ZDecaEtablissementFormation = z.object({
  siret: z.optional(extensions.siret),
});
