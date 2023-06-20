import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "..";
import { IModelDescriptor } from "./common";

const collectionName = "users";

const indexes: IModelDescriptor["indexes"] = [
  [{ email: 1 }, { unique: true }],
  [
    {
      email: "text",
    },
    {
      name: "email_text",
      default_language: "french",
      collation: {
        locale: "simple",
        strength: 1,
      },
    },
  ],
];

export const SUser = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    email: { type: "string" },
    password: { type: "string" },
    person_id: { type: "string" },
    is_admin: { type: "boolean" },
    api_key: { type: "string" },
    api_key_used_at: {
      type: "string",
      format: "date-time",
      description: "Date de denière utilisation de la clé api",
    },
  },
  required: ["_id", "email", "password", "person_id"],
} as const;

export interface IUser
  extends FromSchema<typeof SUser, { deserialize: deserialize }> {}

export default { schema: SUser, indexes, collectionName };
