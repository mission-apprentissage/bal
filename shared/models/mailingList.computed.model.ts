import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "mailingList.computed" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ mailing_list_id: 1, line_number: -1 }, { unique: true }],
  [{ mailing_list_id: 1, email_status: 1, email: 1 }, {}],
  [{ ttl: 1 }, { expireAfterSeconds: 0 }],
];

export const ZMailingListComputedDatum = z.object({
  _id: zObjectId,
  mailing_list_id: zObjectId,
  line_number: z.number(),
  email: z.string(),
  data: z.record(z.string(), z.string()),
  email_status: z.enum(["empty", "invalid", "blacklisted", "valid"]),
  ttl: z.date(),
});

export type IMailingListComputedDatum = z.output<typeof ZMailingListComputedDatum>;

export const mailingListComputedDatumModelDescriptor = {
  zod: ZMailingListComputedDatum,
  indexes,
  collectionName,
};
