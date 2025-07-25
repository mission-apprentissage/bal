import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import { extensions } from "../../../helpers/zodHelpers/zodPrimitives";

export const ZDecaEtablissementFormation = z.object({
  siret: z.optional(extensions.siret),
});

export type IDecaEtablissementFormation = z.output<typeof ZDecaEtablissementFormation>;
export type IDecaEtablissementFormationJson = Jsonify<z.input<typeof ZDecaEtablissementFormation>>;
