import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";
import { IPerson, ZPerson } from "./person.model";

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

export const ZUser = z
  .object({
    _id: zObjectId,
    email: z.string().email().describe("Email de l'utilisateur"),
    password: z.string().describe("Mot de passe de l'utilisateur"),
    person_id: z.string().describe("Identifiant de la personne"),
    is_admin: z.boolean().optional().describe("Est administrateur"),
    api_key: z.string().optional().describe("Clé API"),
    api_key_used_at: z.date().nullish().describe("Date de dernière utilisation de la clé API"),
    updated_at: z.date().optional().describe("Date de mise à jour en base de données"),
    created_at: z.date().optional().describe("Date d'ajout en base de données"),
  })
  .strict();

export const ZUserPublic = z
  .object({
    _id: zObjectId,
    email: ZUser.shape.email,
    person_id: ZUser.shape.person_id,
    is_admin: ZUser.shape.is_admin,
    api_key_used_at: ZUser.shape.api_key_used_at,
    updated_at: ZUser.shape.updated_at,
    created_at: ZUser.shape.created_at,
  })
  .strict();

export type IUser = z.output<typeof ZUser>;
export type IUserPublic = Jsonify<z.output<typeof ZUserPublic>>;

export interface IUserWithPerson extends IUser {
  person: null | IPerson;
}
export const zUserWithPersonPublic = ZUserPublic.extend({
  person: ZPerson.nullish(),
});
export type IUserWithPersonPublic = Jsonify<z.output<typeof zUserWithPersonPublic>>;

export function toPublicUser(
  user: IUserWithPerson
): z.output<typeof zUserWithPersonPublic> {
  return {
    _id: user._id,
    email: user.email,
    person: user.person,
    person_id: user.person_id,
    is_admin: user.is_admin,
    api_key_used_at: user.api_key_used_at,
    updated_at: user.updated_at,
    created_at: user.created_at,
  };
}

export default {
  zod: ZUser,
  indexes,
  collectionName,
};
