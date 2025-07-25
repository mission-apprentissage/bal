import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "bouncer.email" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ email: 1 }, { unique: true }],
  [{ ttl: 1 }, { expireAfterSeconds: 0 }],
];

const zEmailStatus = z.enum(["valid", "invalid", "not_supported", "error"]);

export type EmailStatus = z.output<typeof zEmailStatus>;

export const zBouncerPingResult = z.object({
  status: zEmailStatus,
  message: z.string(),
  responseCode: z.nullable(z.string()),
  responseMessage: z.nullable(z.string()),
});

export type BouncerPingResult = z.output<typeof zBouncerPingResult>;

export const zBouncerEmail = z.object({
  _id: zObjectId,
  email: z.string(),
  domain: z.nullable(z.string()),
  smtp: z.nullable(z.string()),
  ping: zBouncerPingResult,
  created_at: z.date(),
  ttl: z.nullable(z.date()),
});

export type BouncerEmail = z.output<typeof zBouncerEmail>;

export const bouncerEmailModelDescriptor = {
  zod: zBouncerEmail,
  indexes,
  collectionName,
};
