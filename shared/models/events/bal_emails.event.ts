import { z } from "zod/v4-mini";

import { zTemplate } from "../../mailer";
import { zObjectId } from "../common";

const zEmailError = z.object({
  type: z.optional(z.enum(["fatal", "soft_bounce", "hard_bounce", "complaint", "invalid_email", "blocked", "error"])),
  message: z.optional(z.string()),
});
export type IEmailError = z.output<typeof zEmailError>;

export const ZEventBalEmail = z.object({
  _id: zObjectId,
  type: z.literal("email.bal"),
  person_id: z.string(),
  template: zTemplate,
  created_at: z.date(),
  updated_at: z.date(),
  opened_at: z.nullable(z.date()),
  delivered_at: z.nullable(z.date()),
  messageId: z.nullable(z.string()),
  errors: z.array(zEmailError),
});

export type IEventBalEmail = z.output<typeof ZEventBalEmail>;
