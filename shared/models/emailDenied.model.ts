import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "emailDenied" as const;

const indexes: IModelDescriptor["indexes"] = [[{ email: 1 }, {}]];

export const ZEmailDenied = z.object({
  _id: zObjectId,
  email: z.string(),
  reason: z.literal("unsubscribe"),
  updated_at: z.optional(z.date()),
  created_at: z.date(),
});

export type IEmailDenied = z.output<typeof ZEmailDenied>;

export default {
  zod: ZEmailDenied,
  indexes,
  collectionName,
};
