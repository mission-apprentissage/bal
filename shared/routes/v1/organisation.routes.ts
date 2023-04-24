import { FromSchema } from "json-schema-to-ts";

export const SReqPostOrganisationValidation = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    siret: { type: "string", "pattern": "^[0-9]{14}$" },
  },
  required: ["email", "siret"],
} as const;

export type IReqPostOrganisationValidation = FromSchema<typeof SReqPostOrganisationValidation>;

export const SResPostOrganisationValidation = {
  type: "object",
  properties: {
    is_valid: { type: "boolean" },
    on: { type: "string", "enum": ["email", "domain"] },
  },
  required: ["is_valid"],
} as const;

export type IResOrganisationValidation = FromSchema<typeof SResPostOrganisationValidation>;

export const SReqHeadersOrganisation = {
  type: "object",
  properties: {
    Authorization: { type: "string" },
  },
};
