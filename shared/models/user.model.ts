import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor, toJsonSchemaOptions, zObjectId } from "./common";

const collectionName = "users" as const;

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

export const ZUser = () =>
  z
    .object({
      _id: zObjectId,
      email: z.string().email().describe("Email de l'utilisateur"),
      password: z.string().min(8).describe("Mot de passe de l'utilisateur"),
      person_id: z.string().describe("Identifiant de la personne"),
      is_admin: z.boolean().optional().describe("Est administrateur"),
      api_key: z.string().optional().describe("Clé API"),
      api_key_used_at: z
        .date()
        .nullish()
        .describe("Date de dernière utilisation de la clé API"),
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

export const SUser = zodToJsonSchema(ZUser(), toJsonSchemaOptions);

export type IUser = z.input<ReturnType<typeof ZUser>>;

export default {
  schema: SUser as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
