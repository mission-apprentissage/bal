import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "brevo.listes" as const;

const indexes: IModelDescriptor["indexes"] = [[{ listId: 1 }, { unique: true }]];

export const zBrevoListes = z.object({
  _id: zObjectId,
  listId: z.number(),
  env: z.enum(["local", "recette", "production", "preview", "test"]),
  product: z.enum(["tdb", "lba"]),
  nom: z.string(),
  created_at: z.date(),
  updated_at: z.date().optional(),
});

export type BrevoListes = z.output<typeof zBrevoListes>;

export const brevoListesModelDescriptor = {
  zod: zBrevoListes,
  indexes,
  collectionName,
};
