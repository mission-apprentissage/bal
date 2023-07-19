import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { SJob, ZJob } from "../models/job.model";

export const ZReqGetMailingList = () =>
  z.object({ source: z.string() }).strict();

export const SReqGetMailingList = zodToJsonSchema(ZReqGetMailingList());
export type IReqGetMailingList = z.input<ReturnType<typeof ZReqGetMailingList>>;

export const ZResGetMailingLists = () => z.array(ZJob());
export const SResGetMailingLists = zodToJsonSchema(ZResGetMailingLists());

export type IResGetMailingLists = z.input<
  ReturnType<typeof ZResGetMailingLists>
>;

export const SResGetMailingList = SJob;
export type IResGetMailingList = z.input<ReturnType<typeof ZJob>>;
