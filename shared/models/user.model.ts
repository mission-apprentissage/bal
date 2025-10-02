import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";
import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

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
  is_admin: z.boolean(),
  is_support: z.boolean(),
  api_key: z.nullable(z.string()),
  api_key_used_at: z.nullable(z.date()),
  updated_at: z.date(),
  created_at: z.date(),
});

export const ZUserPublic = z.object({
  _id: zObjectId,
  email: ZUser.shape.email,
  is_admin: ZUser.shape.is_admin,
  is_support: ZUser.shape.is_support,
  api_key_used_at: ZUser.shape.api_key_used_at,
  updated_at: ZUser.shape.updated_at,
  created_at: ZUser.shape.created_at,
});

export type IUser = z.output<typeof ZUser>;
export type IUserPublic = Jsonify<z.output<typeof ZUserPublic>>;

export default {
  zod: ZUser,
  indexes,
  collectionName,
};
