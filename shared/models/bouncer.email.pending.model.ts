import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "bouncer.email.pending" as const;

const indexes: IModelDescriptor["indexes"] = [[{ email: 1 }, { unique: true }]];

export const zBouncerEmailPending = z.object({
  _id: zObjectId,
  email: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
  treated: z.boolean(),
});

export type BouncerEmailPending = z.output<typeof zBouncerEmailPending>;

export const bouncerEmailPendingModelDescriptor = {
  zod: zBouncerEmailPending,
  indexes,
  collectionName,
};
