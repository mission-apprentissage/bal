import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { toJsonSchemaOptions } from "../common";

export const ZBalEmail = () =>
  z.object({
    token: z.string(),
    templateName: z.string(),
    payload: z
      .object({
        recipient: z
          .object({
            email: z.string(),
          })
          .nonstrict(),
      })
      .nonstrict(),
    sendDates: z.array(z.date()),
    openDate: z.date().optional(),
    messageIds: z.array(z.string()).optional(),
    error: z
      .array(
        z
          .object({
            err_type: z
              .enum([
                "fatal",
                "soft_bounce",
                "hard_bounce",
                "complaint",
                "invalid_email",
                "blocked",
                "error",
              ])
              .optional(),
            message: z.string().optional(),
          })
          .nonstrict()
      )
      .optional(),
  });

export const SBalEmail = zodToJsonSchema(ZBalEmail());

export const ZBalEmails = () => z.array(ZBalEmail());

export const SBalEmails = zodToJsonSchema(ZBalEmails());

export const ZBalEmailsPayload = () =>
  z
    .object({
      emails: ZBalEmails(),
      unsubscribe: z.boolean().optional().describe("unsubscribe email"),
    })
    .nonstrict();

export const SBalEmailsPayload = zodToJsonSchema(
  ZBalEmailsPayload(),
  toJsonSchemaOptions
);

export type IBalEmail = z.input<ReturnType<typeof ZBalEmail>>;
export type IBalEmails = z.input<ReturnType<typeof ZBalEmails>>;
export type IBalEmailsPayload = z.input<ReturnType<typeof ZBalEmailsPayload>>;
