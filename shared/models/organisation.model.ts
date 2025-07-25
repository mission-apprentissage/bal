import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "organisations" as const;

const indexes: IModelDescriptor["indexes"] = [
  [
    {
      nom: "text",
      email_domains: "text",
      "etablissements.nom": "text",
      "etablissements.siret": "text",
    },
    {
      name: "nom_domains_etabnom_etabsiret_text",
      default_language: "french",
      collation: {
        locale: "simple",
        strength: 1,
      },
    },
  ],
  [{ siren: 1 }, { unique: true }],
  [{ siren: 1, email_domains: 1 }, { name: "siren_email_domains" }],
  [{ "etablissements.siret": 1 }, { name: "siret" }],
];

export const ZOrganisation = z.object({
  _id: zObjectId,
  nom: z.optional(z.string()),
  siren: z.optional(z.string()),
  email_domains: z.optional(z.array(z.string())),
  etablissements: z.optional(
    z.array(
      z.object({
        nom: z.optional(z.string()),
        siret: z.optional(z.string()),
        is_hq: z.optional(z.boolean()),
        is_close: z.optional(z.boolean()),
      })
    )
  ),
  _meta: z.optional(
    z.looseObject({
      sources: z.optional(z.array(z.string())),
    })
  ),
  updated_at: z.optional(z.date()),
  created_at: z.optional(z.date()),
});

export type IOrganisation = z.output<typeof ZOrganisation>;
export type IOrganisationJson = Jsonify<z.input<typeof ZOrganisation>>;

export default {
  zod: ZOrganisation,
  indexes,
  collectionName,
};
