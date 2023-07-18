import { FromSchema } from "json-schema-to-ts";

import { SJob } from "../models/job.model";

export const SReqGetMailingList = {
  type: "object",
  properties: {
    source: { type: "string" },
  },
  required: ["source"],
} as const;

export type IReqGetMailingList = FromSchema<typeof SReqGetMailingList>;

export const SResGetMailingLists = {
  type: "array",
  items: SJob,
} as const;

export type IResGetMailingLists = FromSchema<typeof SResGetMailingLists>;

export const SResGetMailingList = SJob;

export type IResGetMailingList = FromSchema<typeof SResGetMailingList>;
