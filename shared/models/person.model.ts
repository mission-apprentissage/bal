import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";
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
  [{ organisation_id: 1 }, { name: "organisation_id" }],
];

export const ZPerson = z
  .object({
    _id: zObjectId,
    email: z.string().email().describe("Email de la personne"),
    civility: z.enum(["Madame", "Monsieur"]).optional().describe("civilité"),
    nom: z.string().optional().describe("Le nom de la personne"),
    prenom: z.string().optional().describe("Le prénom de la personne"),
    organisations: z
      .array(z.string().describe("Identifiant de l'organisation"))
      .describe("Liste des organisations"),
    sirets: z
      .array(z.string())
      .optional()
      .describe("Liste de sirets recensé (sécurisation qualité de la donnée)"),
    _meta: z
      .object({
        source: z.string().optional(),
      })
      .describe("Métadonnées")
      .nonstrict()
      .optional(),
    updated_at: z
      .date()
      .describe("Date de mise à jour en base de données")
      .optional(),
    created_at: z.date().describe("Date d'ajout en base de données").optional(),
  })
  .strict();

export const ZPersonWithOrganisation = ZPerson.extend({
  organisation: ZOrganisation.nullish(),
}).strict();

export type IPerson = z.output<typeof ZPerson>;
export type IPersonJson = Jsonify<z.input<typeof ZPerson>>;

// Make exact type
export type PersonWithOrganisation = z.output<typeof ZPersonWithOrganisation>;
export type PersonWithOrganisationJson = Jsonify<
  z.input<typeof ZPersonWithOrganisation>
>;

export default {
  zod: ZPerson,
  indexes,
  collectionName,
};
