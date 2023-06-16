import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "../..";
import { DOCUMENT_TYPES } from "../upload.routes";

export const SReqGetMailingList = {
  type: "object",
  properties: {
    source: { type: "string", enum: Object.values(DOCUMENT_TYPES) },
  },
  required: ["source"],
} as const;

export type IReqGetMailingList = FromSchema<typeof SReqGetMailingList>;

export const SResGetMailingList = {
  type: "object",
  properties: {
    _id: { type: "string", format: "ObjectId" },
    source: {
      type: "string",
    },
    document_id: {
      type: "string",
      description: "Fichier liste de diffusion",
    },
    status: {
      type: "string",
    },
    user_id: {
      type: "string",
    },
    updated_at: {
      type: "string",
      format: "date-time",
      description: "Date de mise à jour en base de données",
    },
    created_at: {
      type: "string",
      format: "date-time",
      description: "Date d'ajout en base de données",
    },
  },
  required: ["_id", "source", "status", "user_id"],
  additionalProperties: false,
} as const;

export type IResGetMailingList = FromSchema<
  typeof SReqGetMailingList,
  { deserialize: deserialize }
>;

export const SResGetMailingLists = {
  type: "array",
  items: SResGetMailingList,
} as const;
