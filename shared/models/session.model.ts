import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "..";
import { IModelDescriptor } from "./common";

const collectionName = "sessions";

const indexes: IModelDescriptor["indexes"] = [];

export const SSession = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    token: { type: "string" },
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
  required: ["token"],
} as const;

export interface ISession
  extends FromSchema<typeof SSession, { deserialize: deserialize }> {}

export default { schema: SSession, indexes, collectionName };
