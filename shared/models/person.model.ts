import { WithId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor, toJsonSchemaOptions, zObjectId } from "./common";

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
    organisation_id: z.string().describe("Identifiant de l'organisation"),
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
  .required({
    _id: true,
    email: true,
    organisation_id: true,
  })
  .strict();

export const SPerson = zodToJsonSchema(ZPerson, toJsonSchemaOptions);

export type IPerson = z.input<typeof ZPerson>;
export type IPersonDocument = WithId<Omit<IPerson, "_id">>;

export default {
  schema: SPerson as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
