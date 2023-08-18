import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "organisations" as const;

const indexes: IModelDescriptor["indexes"] = [
  [
    {
      nom: "text",
      email_domains: "text",
      "etablissements.nom": "text",
      "etablissements.siret": "text",
    },
    {
      name: "nom_domains_etabnom_etabsiret_text",
      default_language: "french",
      collation: {
        locale: "simple",
        strength: 1,
      },
    },
  ],
  [{ siren: 1 }, { unique: true }],
  [{ siren: 1, email_domains: 1 }, { name: "siren_email_domains" }],
  [{ "etablissements.siret": 1 }, { name: "siret" }],
];

export const ZOrganisation = z
  .object({
    _id: zObjectId,
    nom: z.string().optional().describe("Nom de l'organisation"),
    siren: z.string().optional().describe("Siren de l'organisation"),
    email_domains: z
      .array(z.string())
      .optional()
      .describe("Liste des domaines email"),
    etablissements: z
      .array(
        z
          .object({
            nom: z.string().optional().describe("Nom de l'établissement"),
            siret: z
              .string()
              .optional()
              .describe("Siret actif de l'établissement"),
            is_hq: z.boolean().optional().describe("Siège social"),
            is_close: z.boolean().optional().describe("Est fermé"),
          })
          .strict()
      )
      .optional()
      .describe("Liste des établissements"),
    _meta: z
      .object({
        source: z.string().optional(),
      })
      .nonstrict()
      .optional()
      .describe("Métadonnées"),
    updated_at: z
      .date()
      .optional()
      .describe("Date de mise à jour en base de données"),
    created_at: z.date().optional().describe("Date d'ajout en base de données"),
  })
  .strict();

export type IOrganisation = z.output<typeof ZOrganisation>;
export type IOrganisationJson = Jsonify<z.input<typeof ZOrganisation>>;

export default {
  zod: ZOrganisation,
  indexes,
  collectionName,
};
