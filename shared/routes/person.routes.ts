import { FromSchema } from "json-schema-to-ts";

import { SOrganisation } from "../models/organisation.model";

export const SResGetPerson = {
  type: "object",
  properties: {
    _id: { type: "string" },
    email: { type: "string" },
    civility: {
      type: "string",
      enum: ["Madame", "Monsieur"],
    },
    nom: { type: "string" },
    prenom: { type: "string" },
    organisation_id: { type: "string" },
    organisation: SOrganisation,
    sirets: {
      type: "array",
      items: {
        type: "string",
      },
    },
    _meta: {
      type: "object",
      properties: {
        source: { type: "string" },
      },
      additionalProperties: true,
    },
    updated_at: {
      type: "string",
      format: "date-time",
    },
    created_at: {
      type: "string",
      format: "date-time",
    },
  },
  required: ["_id", "email", "organisation_id"],
} as const;

export type IResGetPerson = FromSchema<typeof SResGetPerson>;

export const SResGetPersons = {
  type: "array",
  items: SResGetPerson,
} as const;

export type IResGetPersons = FromSchema<typeof SResGetPersons>;

export const SReqPatchPerson = {
  type: "object",
  properties: {
    nom: { type: "string" },
    prenom: { type: "string" },
    civility: {
      type: "string",
      enum: ["Madame", "Monsieur"],
    },
    sirets: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
} as const;

export type IReqPatchPerson = FromSchema<typeof SReqPatchPerson>;
