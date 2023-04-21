import { FromSchema } from "json-schema-to-ts";

const collectionName = "uploads";

const indexes = () => {
  return [];
};

export const SUpload = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "Identifiant du document",
    },
    type_document: {
      type: "string",
      description: "Le type de document (exemple: DECA, etc..)",
    },
    ext_fichier: {
      type: "string",
      description: "Le type de fichier extension",
      enum: ["xlsx", "xls", "csv"], // 10mb
    },
    nom_fichier: {
      type: "string",
      description: "Le nom de fichier",
    },
    chemin_fichier: {
      type: "string",
      description: "Chemin du fichier binaire",
    },
    taille_fichier: {
      type: "integer",
      description: "Taille du fichier en bytes",
    },
    hash_secret: {
      type: "string",
      description: "Hash fichier",
    },
    hash_fichier: {
      type: "string",
      description: "Checksum fichier",
    },
    confirm: {
      type: "boolean",
      description: "Le document est confirmé par l'utilisateur",
    },
    added_by: {
      type: "string",
      description: "Qui a ajouté le fichier",
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
  required: [
    "_id",
    "ext_fichier",
    "nom_fichier",
    "chemin_fichier",
    "taille_fichier",
    "hash_fichier",
    "added_by",
    "created_at",
  ],
} as const;

export interface IUpload
  extends FromSchema<
    typeof SUpload,
    {
      deserialize: [
        {
          pattern: {
            type: "string";
            format: "date-time";
          };
          output: Date;
        }
      ];
    }
  > {}

export default { schema: SUpload, indexes, collectionName };
