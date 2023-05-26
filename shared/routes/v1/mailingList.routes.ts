import { FromSchema } from "json-schema-to-ts";

import { DOCUMENT_TYPES } from "../upload.routes";

export const SReqGetMailingList = {
  type: "object",
  properties: {
    source: { type: "string", enum: Object.values(DOCUMENT_TYPES) },
  },
  required: ["source"],
} as const;

export type IReqGetMailingList = FromSchema<typeof SReqGetMailingList>;
