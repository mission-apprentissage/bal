import { z } from "zod";

import { zTemplate } from "../../mailer";
import { zObjectId } from "../common";

const zEmailError = z.object({
  type: z.enum(["fatal", "soft_bounce", "hard_bounce", "complaint", "invalid_email", "blocked", "error"]).optional(),
  message: z.string().optional(),
});
export type IEmailError = z.output<typeof zEmailError>;

export const ZEventBalEmail = z.object({
  _id: zObjectId,
  type: z.literal("email.bal").describe("Type de l'évènement"),
  person_id: z.string().describe("Identifiant de la personne"),
  template: zTemplate,
  created_at: z.date(),
  updated_at: z.date(),
  opened_at: z.date().nullable(),
  delivered_at: z.date().nullable(),
  messageId: z.string().nullable(),
  errors: z.array(zEmailError),
});

export type IEventBalEmail = z.output<typeof ZEventBalEmail>;
