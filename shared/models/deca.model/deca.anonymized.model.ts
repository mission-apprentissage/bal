import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "../common";
import { ZDecaEmployeur } from "./parts/deca.employeur.part";
import { ZDeca } from "./deca.model";

const collectionName = "anonymized.deca" as const;

const indexes: IModelDescriptor["indexes"] = [
  [
    { no_contrat: 1, type_contrat: 1, "alternant.nom": 1 },
    { unique: true, name: "no_contrat_1_type_contrat_1_alternant.nom_1" },
  ],
  [{ "organisme_formation.siret": 1 }, {}],
  [{ "etablissement_formation.siret": 1 }, {}],
  [{ created_at: -1 }, {}],
];

export const ZDecaAnonymized = z.extend(
  z.omit(ZDeca, {
    alternant: true,
    employeur: true,
  }),
  {
    employeur: z.omit(ZDecaEmployeur, {
      telephone: true,
      courriel: true,
    }),
  }
);

export type IDecaAnonymized = z.output<typeof ZDecaAnonymized>;

export default {
  zod: ZDecaAnonymized,
  indexes,
  collectionName,
};
