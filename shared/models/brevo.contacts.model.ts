import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "brevo.contacts" as const;

const indexes: IModelDescriptor["indexes"] = [[{ email: 1 }, { unique: true }]];

export const zBrevoContacts = z.object({
  _id: zObjectId,
  email: z.string(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
  treated: z.boolean(),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  url: z.string().optional(),
  telephone: z.string().optional(),
  nomOrganisme: z.string().optional(),
});

export type BrevoContacts = z.output<typeof zBrevoContacts>;
export type IBrevoContactsAPI = Omit<BrevoContacts, "_id" | "created_at" | "updated_at" | "treated">;

export const brevoContactsModelDescriptor = {
  zod: zBrevoContacts,
  indexes,
  collectionName,
};
