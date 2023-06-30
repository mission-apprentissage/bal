import { FromSchema } from "json-schema-to-ts";

import { SJob } from "../models/job.model";
import { DOCUMENT_TYPES } from "./upload.routes";

export const SReqGetMailingList = {
  type: "object",
  properties: {
    source: { type: "string", enum: Object.values(DOCUMENT_TYPES) },
  },
  required: ["source"],
} as const;

export type IReqGetMailingList = FromSchema<typeof SReqGetMailingList>;

export const SResGetMailingLists = {
  type: "array",
  items: SJob,
} as const;

export type IResGetMailingLists = FromSchema<typeof SResGetMailingLists>;
