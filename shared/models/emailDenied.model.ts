import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "emailDenied" as const;

const indexes: IModelDescriptor["indexes"] = [[{ email: 1 }, {}]];

export const ZEmailDenied = z
  .object({
    _id: zObjectId,
    email: z.string().describe("L'email rejetée"),
    reason: z.enum(["unsubscribe"]),
    updated_at: z.date().optional().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export type IEmailDenied = z.output<typeof ZEmailDenied>;

export default {
  zod: ZEmailDenied,
  indexes,
  collectionName,
};
