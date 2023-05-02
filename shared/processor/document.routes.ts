import { FromSchema } from "json-schema-to-ts";

export const SReqPostProcessorDocument = {
  type: "object",
  properties: {
    document_id: { type: "string" },
  },
  required: ["document_id"],
} as const;

export type IReqPostProcessorDocument = FromSchema<
  typeof SReqPostProcessorDocument
>;

export const SResPostProcessorDocument = {
  type: "object",
  properties: {
    started: { type: "boolean" },
  },
  required: ["started"],
  additionalProperties: false,
} as const;
