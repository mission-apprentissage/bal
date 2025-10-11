import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";
import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "persons" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ email: 1, siret: 1, source: 1 }, { unique: true }],
  [{ email: 1, created_at: 1 }, {}],
  [{ siret: 1, created_at: 1 }, {}],
  [{ created_at: 1 }, {}],
  [{ updated_at: 1 }, {}],
  [{ ttl: 1 }, { expireAfterSeconds: 0 }],
];

export const ZPerson = z.object({
  _id: zObjectId,
  email: z.string(),
  siret: z.string(),
  source: z.string(),
  updated_at: z.date(),
  created_at: z.date(),
  ttl: z.date(),
});

export type IPerson = z.output<typeof ZPerson>;
export type IPersonJson = Jsonify<z.input<typeof ZPerson>>;

export default {
  zod: ZPerson,
  indexes,
  collectionName,
};
