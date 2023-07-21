import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { IModelDescriptor, toJsonSchemaOptions, zObjectId } from "./common";

const collectionName = "sessions" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const ZSession = () =>
  z
    .object({
      _id: zObjectId,
      token: z.string().describe("Token de la session"),
      updated_at: z
        .date()
        .optional()
        .describe("Date de mise à jour en base de données"),
      created_at: z
        .date()
        .optional()
        .describe("Date d'ajout en base de données"),
    })
    .strict();

export const SSession = zodToJsonSchema(ZSession(), toJsonSchemaOptions);

export type ISession = z.input<ReturnType<typeof ZSession>>;

export default {
  schema: SSession as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
