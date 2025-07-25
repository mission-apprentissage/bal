import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "../common";
import { zObjectId } from "../common";
import { ZDecaApprenant } from "./parts/deca.apprenant.part";
import { ZDecaEmployeur } from "./parts/deca.employeur.part";
import { ZDecaEtablissementFormation } from "./parts/deca.etablissementFormation.part";
import { ZDecaFormation } from "./parts/deca.formation.part";
import { ZDecaOrganismeFormation } from "./parts/deca.organismeFormation.part";

const collectionName = "deca" as const;

const indexes: IModelDescriptor["indexes"] = [
  [
    { no_contrat: 1, type_contrat: 1, "alternant.nom": 1 },
    { unique: true, name: "no_contrat_1_type_contrat_1_alternant.nom_1" },
  ],
  [{ "organisme_formation.siret": 1 }, {}],
  [{ "etablissement_formation.siret": 1 }, {}],
  [{ created_at: -1 }, {}],
];

export const ZDeca = z.object({
  _id: zObjectId,

  no_contrat: z.string(),
  statut: z.optional(z.string()),
  flag_correction: z.optional(z.boolean()),
  date_suppression: z.optional(z.date()),
  date_debut_contrat: z.date(),
  date_fin_contrat: z.date(),
  date_effet_avenant: z.optional(z.date()),
  date_effet_rupture: z.optional(z.date()),
  no_avenant: z.optional(z.string()),
  dispositif: z.optional(z.string()),
  type_contrat: z.optional(z.string()),
  // type_contrat: z
  //   .enum(["11", "21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "38"]) // 24
  //   .optional()
  rupture_avant_debut: z.optional(z.boolean()),

  type_employeur: z.optional(z.number()),
  employeur_specifique: z.optional(z.number()),
  type_derogation: z.optional(z.number()),

  alternant: ZDecaApprenant,
  formation: ZDecaFormation,
  etablissement_formation: z.optional(ZDecaEtablissementFormation),
  organisme_formation: z.optional(ZDecaOrganismeFormation),
  employeur: ZDecaEmployeur,
  updated_at: z.date(),
  created_at: z.date(),
});

export type IDeca = z.output<typeof ZDeca>;
export type IDecaJson = Jsonify<z.input<typeof ZDeca>>;

export default {
  zod: ZDeca,
  indexes,
  collectionName,
};
