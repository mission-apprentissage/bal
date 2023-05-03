import { FromSchema } from "json-schema-to-ts";

export const SBalEmails = {
  type: "array",
  items: {
    type: "object",
    properties: {
      token: { type: "string" },
      templateName: { type: "string" },
      payload: {
        type: "object",
        additionalProperties: true,
      },
      sendDates: {
        type: "array",
        items: {
          type: "string",
          format: "date-time",
        },
      },
      openDate: {
        type: "string",
        format: "date-time",
      },
      messageIds: {
        type: "array",
        items: {
          type: "string",
        },
      },
      error: {
        type: "array",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: [
                "fatal",
                "soft_bounce",
                "hard_bounce",
                "complaint",
                "invalid_email",
                "blocked",
                "error",
              ],
            },
            message: { type: "string" },
          },
        },
      },
    },
    required: ["token", "templateName", "sendDates"],
    additionalProperties: true,
  },
} as const;

export const SBalEmailsPayload = {
  type: "object",
  properties: {
    emails: SBalEmails,
    unsubscribe: { type: "boolean", description: "unsubscribe email" },
  },
  additionalProperties: true,
} as const;

export interface IBalEmails extends FromSchema<typeof SBalEmails> {}
export interface IBalEmailsPayload
  extends FromSchema<typeof SBalEmailsPayload> {}
