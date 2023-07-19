import { ObjectId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor } from "./common";

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

export const ZPerson = () =>
  z
    .object({
      _id: z.instanceof(ObjectId).describe("Identifiant de la personne"),
      email: z.string().email().describe("Email de la personne"),
      civility: z.enum(["Madame", "Monsieur"]).optional().describe("civilité"),
      nom: z.string().optional().describe("Le nom de la personne"),
      prenom: z.string().optional().describe("Le prénom de la personne"),
      organisation_id: z.string().describe("Identifiant de l'organisation"),
      sirets: z
        .array(z.string())
        .nullable()
        .optional()
        .describe(
          "Liste de sirets recensé (sécurisation qualité de la donnée)"
        ),
      _meta: z.record(z.any()).describe("Métadonnées"),
      updated_at: z.date().describe("Date de mise à jour en base de données"),
      created_at: z.date().describe("Date d'ajout en base de données"),
    })
    .required({
      _id: true,
      email: true,
      organisation_id: true,
    })
    .strict();

export const SPerson = zodToJsonSchema(ZPerson());

export type IPerson = z.input<ReturnType<typeof ZPerson>>;

export default {
  schema: SPerson as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
