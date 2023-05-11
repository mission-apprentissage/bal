import { FromSchema } from "json-schema-to-ts";

const collectionName = "users";

const indexes = () => {
  return [[{ email: 1 }, { unique: true }]];
};

export const SUser = {
  type: "object",
  properties: {
    _id: { type: "string" },
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
  extends FromSchema<
    typeof SUser,
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

export default { schema: SUser, indexes, collectionName };