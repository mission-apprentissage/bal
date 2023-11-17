import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "sessions" as const;

const indexes: IModelDescriptor["indexes"] = [[{ expires_at: 1 }, { expireAfterSeconds: 0 }]];

export const ZSession = z
  .object({
    _id: zObjectId,
    token: z.string().describe("Token de la session"),
    updated_at: z.date().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
    expires_at: z.date().describe("Date d'expiration"),
  })
  .strict();

export type ISession = z.output<typeof ZSession>;
export type ISessionJson = Jsonify<z.input<typeof ZSession>>;

export default {
  zod: ZSession,
  indexes,
  collectionName,
};
