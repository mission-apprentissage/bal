import { FromSchema } from "json-schema-to-ts";

import { IModelDescriptor } from "./common";

const collectionName = "organisations";

const indexes: IModelDescriptor["indexes"] = [];

export const SOrganisation = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    nom: { type: "string", description: "Nom de l'organisation" },
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
} as const;

export interface IOrganisation extends FromSchema<typeof SOrganisation> {}
// export interface IOrganisation
//   extends FromSchema<
//     typeof SOrganisation,
//     {
//       deserialize: [
//         {
//           pattern: {
//             type: "string";
//             format: "ObjectId";
//           };
//           output: ObjectId;
//         }
//       ];
//     }
//   > {}

export default { schema: SOrganisation, indexes, collectionName };
