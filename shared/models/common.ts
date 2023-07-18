import { JSONSchema7 } from "json-schema";
import { CreateIndexesOptions, IndexSpecification } from "mongodb";

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
