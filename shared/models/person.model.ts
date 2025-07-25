import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";
import { ZOrganisation } from "./organisation.model";

const collectionName = "persons" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ email: 1 }, { unique: true }],
  [
    { email: "text", nom: "text", prenom: "text", sirets: "text" },
    {
      name: "email_nom_prenom_sirets_text",
      default_language: "french",
      collation: {
        locale: "simple",
        strength: 1,
      },
    },
  ],
];

export const ZPerson = z.object({
  _id: zObjectId,
  email: z.string(),
  civility: z.optional(z.enum(["Madame", "Monsieur"])),
  nom: z.optional(z.string()),
  prenom: z.optional(z.string()),
  organisations: z.array(z.string()),
  sirets: z.optional(z.array(z.string())),
  _meta: z.optional(
    z.looseObject({
      sources: z.optional(z.array(z.string())),
    })
  ),
  updated_at: z.optional(z.date()),
  created_at: z.optional(z.date()),
});

export const ZPersonWithOrganisation = z.object({
  ...ZPerson.shape,
  organisation: z.nullish(ZOrganisation),
});

export type IPerson = z.output<typeof ZPerson>;
export type IPersonJson = Jsonify<z.input<typeof ZPerson>>;

// Make exact type
export type PersonWithOrganisation = z.output<typeof ZPersonWithOrganisation>;
export type PersonWithOrganisationJson = Jsonify<z.input<typeof ZPersonWithOrganisation>>;

export default {
  zod: ZPerson,
  indexes,
  collectionName,
};
