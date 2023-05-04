import { FromSchema } from "json-schema-to-ts";

const collectionName = "persons";

const indexes = () => {
  return [
    [{ email: 1 }, { unique: true }],
    [{ email: "text", nom: "text", prenom: "text" }, {}],
    [{ organisation_id: 1 }, {}],
  ];
};

export const SPerson = {
  type: "object",
  properties: {
    _id: { type: "string" },
    email: { type: "string" },
    civility: {
      type: "string",
      description: "civilité",
      enum: ["Madame", "Monsieur"],
    },
    nom: { type: "string", description: "Le nom de la personne" },
    prenom: { type: "string", description: "Le prénom de la personne" },
    organisation_id: { type: "string" },
    sirets: {
      type: "array",
      items: {
        type: "string",
      },
      description:
        "Liste de sirets recensé (sécurisation qualité de la donnée)",
    },
    _meta: {
      type: "object",
      properties: {
        source: { type: "string" },
      },
      additionalProperties: true,
    },
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
  required: ["_id", "email", "organisation_id"],
} as const;

export interface IPerson extends FromSchema<typeof SPerson> {}

export default { schema: SPerson, indexes, collectionName };
