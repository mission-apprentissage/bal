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
    civility: {
      type: "string",
      description: "civilité",
      enum: ["Madame", "Monsieur"],
    },
    nom: { type: "string", description: "Le nom de la personne" },
    prenom: { type: "string", description: "Le prénom de la personne" },
    password: { type: "string" },
    is_admin: { type: "boolean" },
    api_key: { type: "string" },
    api_key_used_at: {
      type: "string",
      format: "date-time",
      description: "Date de denière utilisation de la clé api",
    },
  },
  required: ["_id", "email", "password"],
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
