import { FromSchema } from "json-schema-to-ts";

import { SOrganisation } from "../models/organisation.model";

export const SResGetOrganisation = SOrganisation;

export type IResGetOrganisation = FromSchema<typeof SResGetOrganisation>;

export const SResGetOrganisations = {
  type: "array",
  items: SOrganisation,
} as const;

export type IResGetOrganisations = FromSchema<typeof SResGetOrganisations>;

export const SReqPatchOrganisation = {
  type: "object",
  properties: {
    nom: { type: "string" },
    email_domains: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  additionalProperties: false,
} as const;

export type IReqPatchOrganisation = FromSchema<typeof SReqPatchOrganisation>;
