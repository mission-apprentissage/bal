import { JSONSchema7 } from "json-schema";
import { CreateIndexesOptions, IndexSpecification } from "mongodb";
import { z } from "zod";

export type CollectionName =
  | "users"
  | "jobs"
  | "organisations"
  | "persons"
  | "events"
  | "sessions"
  | "documents"
  | "documentContents";

export interface IModelDescriptor {
  schema: JSONSchema7;
  indexes: [IndexSpecification, CreateIndexesOptions][];
  collectionName: CollectionName;
}

export const zObjectId = z.string().length(24).describe("Identifiant unique");

export const toJsonSchemaOptions = {
  definitions: {
    objectId: zObjectId,
  },
};
