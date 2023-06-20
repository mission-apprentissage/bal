import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "..";
import { SOrganisation } from "../models/organisation.model";

export const SResGetOrganisation = SOrganisation;

export type IResGetOrganisation = FromSchema<
  typeof SResGetOrganisation,
  { deserialize: deserialize }
>;

export const SResGetOrganisations = {
  type: "array",
  items: SOrganisation,
} as const;

export type IResGetOrganisations = FromSchema<
  typeof SResGetOrganisations,
  { deserialize: deserialize }
>;
