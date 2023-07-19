import { ObjectId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor } from "./common";

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
];

export const ZOrganisation = () =>
  z
    .object({
      _id: z.instanceof(ObjectId).describe("Identifiant de l'organisation"),
      nom: z.string().optional().describe("Nom de l'organisation"),
      email_domains: z
        .array(z.string())
        .optional()
        .describe("Liste des domaines email"),
      etablissements: z
        .array(
          z
            .object({
              nom: z.string().describe("Nom de l'établissement"),
              siret: z.string().describe("Siret actif de l'établissement"),
              is_hq: z.boolean().describe("Siège social"),
              is_close: z.boolean().describe("Est fermé"),
            })
            .strict()
        )
        .optional()
        .describe("Liste des établissements"),
      _meta: z.record(z.any()).optional().describe("Métadonnées"),
      updated_at: z
        .date()
        .optional()
        .describe("Date de mise à jour en base de données"),
      created_at: z
        .date()
        .optional()
        .describe("Date d'ajout en base de données"),
    })
    .strict();

export const SOrganisation = zodToJsonSchema(ZOrganisation());

export type IOrganisation = z.input<ReturnType<typeof ZOrganisation>>;

export default {
  schema: SOrganisation as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
