import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "mailingList.source" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ mailing_list_id: 1, line_number: -1 }, { unique: true }],
  [{ ttl: 1 }, { expireAfterSeconds: 0 }],
];

export const ZMailingListSource = z.object({
  _id: zObjectId,
  mailing_list_id: zObjectId,
  line_number: z.number(),
  data: z.record(z.string(), z.string()),
  ttl: z.date(),
});

export type IMailingListSource = z.output<typeof ZMailingListSource>;

export const mailingListSourceModelDescriptor = {
  zod: ZMailingListSource,
  indexes,
  collectionName,
};
