import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "brevo.contacts" as const;

const indexes: IModelDescriptor["indexes"] = [[{ email: 1 }, { unique: true }]];

export enum BrevoContactStatusEnum {
  queued = "queued",
  done = "done",
}
export const zBrevoContacts = z.object({
  _id: zObjectId,
  email: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  status: z.nativeEnum(BrevoContactStatusEnum).nullable(),
});

export type BrevoContacts = z.output<typeof zBrevoContacts>;
export type IBrevoContactsAPI = Omit<BrevoContacts, "_id" | "created_at" | "updated_at" | "status">;

export const brevoContactsModelDescriptor = {
  zod: zBrevoContacts,
  indexes,
  collectionName,
};
