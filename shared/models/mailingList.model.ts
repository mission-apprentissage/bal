import { FromSchema } from "json-schema-to-ts";

import { IModelDescriptor } from "./common";
import { SDocument } from "./document.model";

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
    document: SDocument,
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

export enum MAILING_LIST_STATUS {
  PENDING = "pending",
  FINISHED = "finished",
}

export interface IMailingList
  extends FromSchema<
    typeof SMailingList,
    {
      deserialize: [
        {
          pattern: {
            type: "string";
            format: "date-time";
          };
          output: Date | string;
        }
      ];
    }
  > {}

export default { schema: SMailingList, indexes, collectionName };
