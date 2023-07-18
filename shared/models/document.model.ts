import { FromSchema } from "json-schema-to-ts";

import { deserialize } from "..";
import { IModelDescriptor } from "./common";

const collectionName = "documents" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const SDocument = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      format: "ObjectId",
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
    import_progress: {
      type: "number",
      description: "Progress percentage (-1 not started)",
    },
    lines_count: {
      type: "integer",
      description: "Number of lines",
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
    "type_document",
    "ext_fichier",
    "nom_fichier",
    "chemin_fichier",
    "taille_fichier",
    "hash_secret",
    "hash_fichier",
    "added_by",
    "created_at",
  ],
  additionalProperties: false,
} as const;

export interface IDocument
  extends FromSchema<
    typeof SDocument,
    {
      deserialize: deserialize;
    }
  > {}

export interface IDocumentWithContent<TContent> extends IDocument {
  content: TContent;
}

export default {
  schema: SDocument as any as IModelDescriptor["schema"],
  indexes,
  collectionName,
};
