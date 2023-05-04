import { FromSchema } from "json-schema-to-ts";

export const SBalEmail = {
  type: "object",
  properties: {
    token: { type: "string" },
    templateName: { type: "string" },
    payload: {
      type: "object",
      properties: {
        recipient: {
          type: "object",
          properties: {
            email: { type: "string" },
          },
          required: ["email"],
          additionalProperties: true,
        },
      },
      additionalProperties: true,
      required: ["recipient"],
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
  required: ["token", "templateName", "sendDates", "payload"],
  additionalProperties: true,
} as const;

export const SBalEmails = {
  type: "array",
  items: SBalEmail,
} as const;

export const SBalEmailsPayload = {
  type: "object",
  properties: {
    emails: SBalEmails,
    unsubscribe: { type: "boolean", description: "unsubscribe email" },
  },
  required: ["emails"],
  additionalProperties: true,
} as const;

export interface IBalEmail extends FromSchema<typeof SBalEmail> {}
export interface IBalEmails extends FromSchema<typeof SBalEmails> {}
export interface IBalEmailsPayload
  extends FromSchema<typeof SBalEmailsPayload> {}
