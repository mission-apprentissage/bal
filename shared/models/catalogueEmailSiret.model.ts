import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "catalogueEmailSirets" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ email: 1, siret: 1 }, {}],
  [{ email: "text", siret: "text" }, {}],
];

export const ZCatalogueEmailSiret = z
  .object({
    _id: zObjectId,
    email: z.string().email().describe("Email de l'utilisateur"),
    siret: z.string().describe("Siret de l'utilisateur"),
    updated_at: z.date().optional().describe("Date de mise à jour en base de données"),
    created_at: z.date().optional().describe("Date d'ajout en base de données"),
  })
  ;

export type ICatalogueEmailSiret = z.output<typeof ZCatalogueEmailSiret>;

export default {
  zod: ZCatalogueEmailSiret,
  indexes,
  collectionName,
};
