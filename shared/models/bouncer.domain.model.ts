import { z } from "zod";

import { zBouncerPingResult } from "./bouncer.email.model";
import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "bouncer.domain" as const;

const indexes: IModelDescriptor["indexes"] = [[{ domain: 1, smtp: 1 }, { unique: true }]];

export const zBouncerDomain = z.object({
  _id: zObjectId,
  domain: z.string(),
  smtp: z.string(),
  ping: zBouncerPingResult.nullable(),
  updated_at: z.date(),
  created_at: z.date(),
});

export type BouncerDomain = z.output<typeof zBouncerDomain>;

export const bouncerDomailModelDescriptor = {
  zod: zBouncerDomain,
  indexes,
  collectionName,
};
