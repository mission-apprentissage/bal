import { z } from "zod/v4-mini";
import type { IModelDescriptor } from "../common";
import { zObjectId } from "../common";

const collectionName = "lba.emailblacklists" as const;

const ZLbaEmailBlacklist = z.object({
  _id: zObjectId,
  email: z.email(),
  blacklisting_origin: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type ILbaEmailBlacklist = z.output<typeof ZLbaEmailBlacklist>;

export default {
  zod: ZLbaEmailBlacklist,
  indexes: [[{ email: 1 }, { unique: true }]],
  collectionName,
} as const satisfies IModelDescriptor;
