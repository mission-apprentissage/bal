import { Jsonify } from "type-fest";
import { z } from "zod";

import { extensions } from "../../../helpers/zodHelpers/zodPrimitives";

export const ZDecaEtablissementFormation = z
  .object({
    siret: extensions.siret.optional().describe("Le siret de l'établissement de la formation"),
  })
  .strict();

export type IDecaEtablissementFormation = z.output<typeof ZDecaEtablissementFormation>;
export type IDecaEtablissementFormationJson = Jsonify<z.input<typeof ZDecaEtablissementFormation>>;
