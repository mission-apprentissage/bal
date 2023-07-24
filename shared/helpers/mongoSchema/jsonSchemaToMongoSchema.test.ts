import { JSONSchema7 } from "json-schema";
import { describe, expect, it } from "vitest";

import { modelDescriptors } from "../../models/models";
import { jsonSchemaToMongoSchema } from "./jsonSchemaToMongoSchema";

describe("jsonSchemaToMongoSchema", () => {
  it("should convert complex schema", () => {
    const input: JSONSchema7 = {
      type: "object",
      properties: {
        _id: {
          $ref: "#/definitions/objectId",
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
        _meta: {
          type: "object",
          additionalProperties: {},
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
    };

    expect(jsonSchemaToMongoSchema(input)).toEqual({
      bsonType: "object",
      properties: {
        _id: {
          bsonType: "objectId",
          description: "Identifiant unique",
        },
        type_document: {
          bsonType: "string",
          description: "Le type de document (exemple: DECA, etc..)",
        },
        ext_fichier: {
          bsonType: "string",
          description: "Le type de fichier extension",
          enum: ["xlsx", "xls", "csv"], // 10mb
        },
        nom_fichier: {
          bsonType: "string",
          description: "Le nom de fichier",
        },
        chemin_fichier: {
          bsonType: "string",
          description: "Chemin du fichier binaire",
        },
        taille_fichier: {
          bsonType: "int",
          description: "Taille du fichier en bytes",
        },
        hash_secret: {
          bsonType: "string",
          description: "Hash fichier",
        },
        hash_fichier: {
          bsonType: "string",
          description: "Checksum fichier",
        },
        import_progress: {
          bsonType: "number",
          description: "Progress percentage (-1 not started)",
        },
        lines_count: {
          bsonType: "int",
          description: "Number of lines",
        },
        added_by: {
          bsonType: "string",
          description: "Qui a ajouté le fichier",
        },
        updated_at: {
          bsonType: "date",
          description: "Date de mise à jour en base de données",
        },
        created_at: {
          bsonType: "date",
          description: "Date d'ajout en base de données",
        },
        _meta: {
          bsonType: "object",
          additionalProperties: true,
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
    });
  });

  modelDescriptors.forEach((descriptor) => {
    it(`should convert ${descriptor.collectionName} schema`, () => {
      expect(jsonSchemaToMongoSchema(descriptor.schema)).toMatchSnapshot();
    });
  });
});
