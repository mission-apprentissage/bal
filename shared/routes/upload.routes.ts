import { FromSchema } from "json-schema-to-ts";

export enum DOCUMENT_TYPES {
  DECA = "DECA",
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

export type IResPostAdminUpload = FromSchema<typeof SResPostAdminUpload>;
