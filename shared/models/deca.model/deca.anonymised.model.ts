import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "../common";
import { ZDecaApprenant } from "./parts/deca.apprenant.part";
import { ZDecaEmployeur } from "./parts/deca.employeur.part";
import { ZDeca } from "./deca.model";

const collectionName = "deca.anonimised" as const;

const indexes: IModelDescriptor["indexes"] = [
  [
    { no_contrat: 1, type_contrat: 1 },
    { unique: true, name: "no_contrat_1_type_contrat_1_alternant.nom_1" },
  ],
  [{ "organisme_formation.siret": 1 }, {}],
  [{ "etablissement_formation.siret": 1 }, {}],
  [{ created_at: -1 }, {}],
];

export const ZDecaAnonymised = z.extend(
  z.omit(ZDeca, {
    alternant: true,
    employeur: true,
  }),
  {
    alternant: z.pick(ZDecaApprenant, {
      sexe: true,
      nationalite: true,
      handicap: true,
    }),
    employeur: z.omit(ZDecaEmployeur, {
      telephone: true,
      courriel: true,
    }),
  }
);

export type IDecaAnonimised = z.output<typeof ZDecaAnonymised>;

export default {
  zod: ZDecaAnonymised,
  indexes,
  collectionName,
};
