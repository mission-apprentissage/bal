import { z } from "zod/v4-mini";

import { zBouncerPingResult } from "./bouncer.email.model";
import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "bouncer.domain" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ domain: 1, smtp: 1 }, { unique: true }],
  [{ updated_at: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }], // 30 days TTL
];

export const zBouncerDomain = z.object({
  _id: zObjectId,
  domain: z.string(),
  smtp: z.string(),
  ping: z.nullable(zBouncerPingResult),
  updated_at: z.date(),
  created_at: z.date(),
});

export type BouncerDomain = z.output<typeof zBouncerDomain>;

export const bouncerDomailModelDescriptor = {
  zod: zBouncerDomain,
  indexes,
  collectionName,
};
