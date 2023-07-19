import { ObjectId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor } from "./common";

const collectionName = "sessions" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const ZSession = () =>
  z
    .object({
      _id: z.instanceof(ObjectId).describe("Identifiant de la session"),
      token: z.string().describe("Token de la session"),
      updated_at: z.date().describe("Date de mise à jour en base de données"),
      created_at: z.date().describe("Date d'ajout en base de données"),
    })
    .strict();

export const SSession = zodToJsonSchema(ZSession());

export type ISession = z.input<ReturnType<typeof ZSession>>;

export default {
  schema: SSession as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
