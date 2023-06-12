import { FromSchema } from "json-schema-to-ts";

export const SReqPostProcessorMailingList = {
  type: "object",
  properties: {
    mailing_list_id: { type: "string" },
  },
  required: ["mailing_list_id"],
} as const;

export type IReqPostProcessorMailingList = FromSchema<
  typeof SReqPostProcessorMailingList
>;

export const SResPostProcessorMailingList = {
  type: "object",
  properties: {
    started: { type: "boolean" },
  },
  required: ["started"],
  additionalProperties: false,
} as const;
