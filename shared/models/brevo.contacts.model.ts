import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "brevo.contacts" as const;

const indexes: IModelDescriptor["indexes"] = [[{ email: 1 }, { unique: true }]];

export const zBrevoContacts = z.object({
  _id: zObjectId,
  email: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
  treated: z.boolean(),
  nom: z.string(),
  prenom: z.string(),
  urls: z.record(z.string(), z.string()).nullable(),
  telephone: z.string().nullable(),
  nomOrganisme: z.string().nullable(),
});

export type BrevoContacts = z.output<typeof zBrevoContacts>;
export type IBrevoContactsAPI = Omit<BrevoContacts, "_id" | "created_at" | "updated_at" | "treated">;

export const brevoContactsModelDescriptor = {
  zod: zBrevoContacts,
  indexes,
  collectionName,
};
