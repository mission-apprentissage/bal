import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "../common";

const collectionName = "lba.emailblacklists" as const;

export const ZLbaEmailBlacklist = z
  .object({
    _id: zObjectId,
    email: z.string().email(),
    blacklisting_origin: z.string(),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
  })
  .strict();

export type ILbaEmailBlacklist = z.output<typeof ZLbaEmailBlacklist>;
export type ILbaEmailBlacklistJson = Jsonify<z.input<typeof ZLbaEmailBlacklist>>;

export default {
  zod: ZLbaEmailBlacklist,
  indexes: [[{ email: 1 }, { unique: true }]],
  collectionName,
} as const satisfies IModelDescriptor;
