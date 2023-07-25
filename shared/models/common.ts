import { CreateIndexesOptions, IndexSpecification, ObjectId } from "mongodb";
import { z, ZodType } from "zod";

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
  zod: ZodType;
  indexes: [IndexSpecification, CreateIndexesOptions][];
  collectionName: CollectionName;
}

export const zObjectId = z
  .string()
  .length(24)
  .transform((s) => new ObjectId(s))
  .or(z.instanceof(ObjectId))
  .describe("Identifiant unique");
