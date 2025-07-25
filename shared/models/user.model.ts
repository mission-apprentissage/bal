import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";
import type { IPerson } from "./person.model";
import { ZPerson } from "./person.model";

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

export const ZUser = z.object({
  _id: zObjectId,
  email: z.email(),
  password: z.string(),
  person_id: z.string(),
  is_admin: z.optional(z.boolean()),
  is_support: z.optional(z.boolean()),
  api_key: z.optional(z.string()),
  api_key_used_at: z.nullish(z.date()),
  updated_at: z.optional(z.date()),
  created_at: z.optional(z.date()),
});

export const ZUserPublic = z.object({
  _id: zObjectId,
  email: ZUser.shape.email,
  person_id: ZUser.shape.person_id,
  is_admin: ZUser.shape.is_admin,
  is_support: ZUser.shape.is_support,
  api_key_used_at: ZUser.shape.api_key_used_at,
  updated_at: ZUser.shape.updated_at,
  created_at: ZUser.shape.created_at,
});

export type IUser = z.output<typeof ZUser>;
export type IUserPublic = Jsonify<z.output<typeof ZUserPublic>>;

export interface IUserWithPerson extends IUser {
  person: null | IPerson;
}
export const zUserWithPersonPublic = z.object({
  ...ZUserPublic.shape,
  person: z.nullish(ZPerson),
});
export type IUserWithPersonPublic = Jsonify<z.output<typeof zUserWithPersonPublic>>;

export function toPublicUser(user: IUserWithPerson): z.output<typeof zUserWithPersonPublic> {
  return zUserWithPersonPublic.parse({
    _id: user._id,
    email: user.email,
    person: user.person,
    person_id: user.person_id,
    is_admin: user.is_admin,
    is_support: user.is_support,
    api_key_used_at: user.api_key_used_at,
    updated_at: user.updated_at,
    created_at: user.created_at,
  });
}

export default {
  zod: ZUser,
  indexes,
  collectionName,
};
