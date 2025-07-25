import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "../common";
import { zObjectId } from "../common";

const collectionName = "lba.recruteurs.siret.email" as const;

export const ZLbaRecruteursSiretEmail = z.object({
  _id: zObjectId,
  siret: z.string(),
  email: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type ILbaRecruteursSiretEmail = z.output<typeof ZLbaRecruteursSiretEmail>;

export default {
  zod: ZLbaRecruteursSiretEmail,
  indexes: [[{ siret: 1, email: 1 }, {}]],
  collectionName,
} as const satisfies IModelDescriptor;
