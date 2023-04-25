import { FromSchema } from "json-schema-to-ts";

export const DOCUMENT_TYPES = ["DECA", "other"];

export const SReqQueryPostAdminUpload = {
  type: "object",
  properties: {
    type_document: {
      type: "string",
      enum: DOCUMENT_TYPES,
    },
  },
  required: ["type"],
} as const;

export type IReqQueryPostAdminUpload = FromSchema<
  typeof SReqQueryPostAdminUpload
>;

export const SResPostAdminUpload = {
  type: "object",
  properties: {
    _id: {
      type: "string",
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
    confirm: {
      type: "boolean",
    },
    added_by: {
      type: "string",
    },
    updated_at: {
      type: "string",
    },
    created_at: {
      type: "string",
    },
  },
  required: [
    "_id",
    "ext_fichier",
    "nom_fichier",
    "chemin_fichier",
    "taille_fichier",
    "added_by",
    "updated_at",
    "created_at",
  ],
  additionalProperties: false,
} as const;

export type IResPostAdminUpload = FromSchema<typeof SResPostAdminUpload>;
