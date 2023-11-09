import { z } from "zod";

import { zTemplate } from "../../mailer";

export const ZBalEmail = z
  .object({
    token: z.string(),
    template: zTemplate,
    sendDates: z.array(z.date()),
    openDate: z.date().optional(),
    messageIds: z.array(z.string()).optional(),
    error: z
      .array(
        z
          .object({
            err_type: z
              .enum(["fatal", "soft_bounce", "hard_bounce", "complaint", "invalid_email", "blocked", "error"])
              .optional(),
            message: z.string().optional(),
          })
          .passthrough()
      )
      .optional(),
  })
  .passthrough();

export const ZBalEmails = z.array(ZBalEmail);

export const ZBalEmailsPayload = z
  .object({
    emails: ZBalEmails,
    unsubscribe: z.boolean().optional().describe("unsubscribe email"),
  })
  .passthrough();

export type IBalEmail = z.output<typeof ZBalEmail>;
export type IBalEmails = z.output<typeof ZBalEmails>;
export type IBalEmailsPayload = z.output<typeof ZBalEmailsPayload>;
