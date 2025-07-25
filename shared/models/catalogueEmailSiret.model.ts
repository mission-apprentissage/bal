import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "catalogueEmailSirets" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ email: 1, siret: 1 }, {}],
  [{ email: "text", siret: "text" }, {}],
];

export const ZCatalogueEmailSiret = z.object({
  _id: zObjectId,
  email: z.email(),
  siret: z.string(),
  updated_at: z.optional(z.date()),
  created_at: z.optional(z.date()),
});

export type ICatalogueEmailSiret = z.output<typeof ZCatalogueEmailSiret>;

export default {
  zod: ZCatalogueEmailSiret,
  indexes,
  collectionName,
};
