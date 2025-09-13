import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "organisations" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ siren: 1, email_domain: 1, source: 1 }, { unique: true }],
  [{ siren: 1, created_at: 1 }, {}],
  [{ email_domain: 1, created_at: 1 }, {}],
  [{ created_at: 1 }, {}],
  [{ updated_at: 1 }, { expireAfterSeconds: 365 * 24 * 60 * 60 }], // TTL 1 year
];

export const ZOrganisation = z.object({
  _id: zObjectId,
  siren: z.string(),
  email_domain: z.string(),
  source: z.string(),
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
