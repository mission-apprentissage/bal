import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "..";
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
  [{ siren: 1, email_domains: 1 }, { name: "siren_email_domains" }],
];

export const SOrganisation = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    nom: { type: "string", description: "Nom de l'organisation" },
    siren: { type: "string", description: "Siren de l'organisation" },
    email_domains: {
      type: "array",
      items: {
        type: "string",
      },
    },
    etablissements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          nom: { type: "string", description: "Nom de l'établissement" },
          siret: {
            type: "string",
            description: "Siret actif de l'établissement",
          },
          is_hq: { type: "boolean", description: "Siége social" },
          is_close: { type: "boolean", description: "Est fermé" },
        },
      },
    },
    _meta: {
      type: "object",
      properties: {
        source: { type: "string" },
      },
      additionalProperties: true,
    }, // exemple UAI
    updated_at: {
      type: "string",
      format: "date-time",
      description: "Date de mise à jour en base de données",
    },
    created_at: {
      type: "string",
      format: "date-time",
      description: "Date d'ajout en base de données",
    },
  },
  required: ["_id"],
  additionalProperties: false,
} as const;

export interface IOrganisation
  extends FromSchema<typeof SOrganisation, { deserialize: deserialize }> {}

export default {
  schema: SOrganisation as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
