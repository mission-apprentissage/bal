import { FromSchema } from "json-schema-to-ts";

export const SResError = {
  type: "object",
  properties: {
    code: { type: "string" },
    message: { type: "string" },
    statusCode: { type: "number" },
  },
  required: ["message", "statusCode"],
} as const;

export type IResError = FromSchema<typeof SResError>;

export const SReqParamsSearchPagination = {
  type: "object",
  properties: {
    page: { type: "number" },
    limit: { type: "number" },
    q: { type: "string" },
  },
} as const;
