import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "..";

export enum DOCUMENT_TYPES {
  DECA = "DECA",
  VOEUX_PARCOURSUP_MAI_2023 = "Voeux Parcoursup Mai 2023",
  VOEUX_AFFELNET_MAI_2023 = "Voeux Affelnet Mai 2023",
  VOEUX_AFFELNET_JUIN_2023 = "Voeux Affelnet Juin 2023",
}

export const SReqQueryPostAdminUpload = {
  type: "object",
  properties: {
    type_document: {
      type: "string",
      enum: Object.values(DOCUMENT_TYPES),
    },
  },
  required: ["type_document"],
} as const;

export type IReqQueryPostAdminUpload = FromSchema<
  typeof SReqQueryPostAdminUpload
>;

export const SResPostAdminUpload = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      format: "ObjectId",
    },
    type_document: {
      type: "string",
    },
    ext_fichier: {
      type: "string",
    },
    nom_fichier: {
      type: "string",
    },
    chemin_fichier: {
      type: "string",
    },
    taille_fichier: {
      type: "integer",
    },
    // dont send hash_secret, hash_fichier
    import_progress: {
      type: "number",
    },
    lines_count: {
      type: "number",
    },
    added_by: {
      type: "string",
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
  required: [
    "_id",
    "ext_fichier",
    "nom_fichier",
    "chemin_fichier",
    "taille_fichier",
    "added_by",
    "created_at",
  ],
  additionalProperties: false,
} as const;

export const SResGetDocuments = {
  type: "array",
  items: SResPostAdminUpload,
} as const;

export type IResPostAdminUpload = FromSchema<typeof SResPostAdminUpload>;

export type IResGetDocuments = FromSchema<
  typeof SResGetDocuments,
  {
    deserialize: deserialize;
  }
>;
