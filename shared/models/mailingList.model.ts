import { FromSchema } from "json-schema-to-ts";

import { IModelDescriptor } from "./common";

const collectionName = "mailingLists";

const indexes: IModelDescriptor["indexes"] = [];

export const SMailingList = {
  type: "object",
  properties: {
    _id: { type: "string" },
    source: {
      type: "string",
    },
    document_id: {
      type: "string",
      description: "Fichier liste de diffusion",
    },
    status: {
      type: "string",
    },
    user_id: {
      type: "string",
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
  required: ["_id", "source", "status"],
} as const;

export interface IMailingList extends FromSchema<typeof SMailingList> {}

export default { schema: SMailingList, indexes, collectionName };
