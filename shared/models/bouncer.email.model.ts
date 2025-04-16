import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "bouncer.email" as const;

const indexes: IModelDescriptor["indexes"] = [[{ email: 1 }, { unique: true }]];

const zEmailStatus = z.enum(["valid", "invalid", "not_supported", "error"]);

export type EmailStatus = z.output<typeof zEmailStatus>;

export const zBouncerPingResult = z.object({
  status: zEmailStatus,
  message: z.string(),
  responseCode: z.string().nullable(),
  responseMessage: z.string().nullable(),
});

export type BouncerPingResult = z.output<typeof zBouncerPingResult>;

export const zBouncerEmail = z.object({
  _id: zObjectId,
  email: z.string(),
  domain: z.string().nullable(),
  smtp: z.string().nullable(),
  ping: zBouncerPingResult,
  created_at: z.date(),
});

export type BouncerEmail = z.output<typeof zBouncerEmail>;

export const bouncerEmailModelDescriptor = {
  zod: zBouncerEmail,
  indexes,
  collectionName,
};
