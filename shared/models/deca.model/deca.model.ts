import type { Jsonify } from "type-fest";
import { z } from "zod";

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

  no_contrat: z.string().describe("Le numéro du contrat"),
  statut: z.string().optional().describe("Le statut du contrat"), // Vide, corrigé, supprimé, rompu, annulé
  flag_correction: z.boolean().optional().describe("Flag correction"),
  date_suppression: z.date().optional().describe("La date de suppression ?"),
  date_debut_contrat: z.date().describe("La date de début du contrat"), // AAAA-MM-JJ
  date_fin_contrat: z.date().describe("La date de fin du contrat"), // AAAA-MM-JJ
  date_effet_avenant: z.date().optional().describe("La date d'effet de l'avenant du contrat"), // AAAA-MM-JJ
  date_effet_rupture: z.date().optional().describe("La date d'effet de la rupture"), // AAAA-MM-JJ
  no_avenant: z.string().optional().describe("Le numéro de l'avenant du contrat"),
  dispositif: z.string().optional().describe("dispositif"), // PROF/APPR
  type_contrat: z.string().optional(),
  // type_contrat: z
  //   .enum(["11", "21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "38"]) // 24
  //   .optional()
  //   .describe(
  //     "Le type de contrat ou avenant doit correspondre à la situation du contrat (premier contrat, succession de contrats, avenants)."
  //   ),
  rupture_avant_debut: z.boolean().optional().describe("rupture_avant_debut"),

  type_employeur: z.number().optional().describe("Type employeur"),
  employeur_specifique: z.number().optional().describe("Employeur specifique"),
  type_derogation: z.number().optional().describe("Type de dérogation"),

  alternant: ZDecaApprenant,
  formation: ZDecaFormation,
  etablissement_formation: ZDecaEtablissementFormation.optional(),
  organisme_formation: ZDecaOrganismeFormation.optional(),
  employeur: ZDecaEmployeur,
  updated_at: z.date().describe("Date de mise à jour en base de données"),
  created_at: z.date().describe("Date d'ajout en base de données"),
});

export type IDeca = z.output<typeof ZDeca>;
export type IDecaJson = Jsonify<z.input<typeof ZDeca>>;

export default {
  zod: ZDeca,
  indexes,
  collectionName,
};
