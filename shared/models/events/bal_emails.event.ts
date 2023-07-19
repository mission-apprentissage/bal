import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const ZBalEmail = () =>
  z.object({
    token: z.string(),
    templateName: z.string(),
    payload: z.object({
      recipient: z.object({
        email: z.string(),
      }),
    }),
    sendDates: z.array(z.date()),
    openDate: z.date().optional(),
    messageIds: z.array(z.string()).optional().nullable(),
    error: z
      .array(
        z.object({
          err_type: z.enum([
            "fatal",
            "soft_bounce",
            "hard_bounce",
            "complaint",
            "invalid_email",
            "blocked",
            "error",
          ]),
          message: z.string(),
        })
      )
      .optional(),
  });

export const SBalEmail = zodToJsonSchema(ZBalEmail());

export const ZBalEmails = () => z.array(ZBalEmail());

export const SBalEmails = zodToJsonSchema(ZBalEmails());

export const ZBalEmailsPayload = () =>
  z.object({
    emails: ZBalEmails(),
    unsubscribe: z.boolean().optional().describe("unsubscribe email"),
  });

export const SBalEmailsPayload = zodToJsonSchema(ZBalEmailsPayload());

export type IBalEmail = z.input<ReturnType<typeof ZBalEmail>>;
export type IBalEmails = z.input<ReturnType<typeof ZBalEmails>>;
export type IBalEmailsPayload = z.input<ReturnType<typeof ZBalEmailsPayload>>;
