import type { CreateIndexesOptions, IndexSpecification } from "mongodb";
import { ZodType } from "zod";

export type CollectionName =
  | "users"
  | "organisations"
  | "persons"
  | "events"
  | "sessions"
  | "documents"
  | "documentContents"
  | "mailingLists"
  | "emailDenied"
  | "deca"
  | "decaHistory"
  | "decaimportjobresult"
  | "catalogueEmailSirets"
  | "bouncer.email"
  | "bouncer.domain";

export interface IModelDescriptor {
  zod: ZodType;
  indexes: [IndexSpecification, CreateIndexesOptions][];
  collectionName: CollectionName;
}

export { zObjectId } from "zod-mongodb-schema";
