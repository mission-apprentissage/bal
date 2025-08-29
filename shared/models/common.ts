import type { CreateIndexesOptions, IndexSpecification } from "mongodb";
import type { $ZodType } from "zod/v4/core";

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
  | "deca.import.job.result"
  | "catalogueEmailSirets"
  | "bouncer.email"
  | "bouncer.domain"
  | "lba.emailblacklists"
  | "lba.recruteurs.siret.email";

export interface IModelDescriptor {
  zod: $ZodType;
  indexes: [IndexSpecification, CreateIndexesOptions][];
  collectionName: CollectionName;
}

export { zObjectIdMini as zObjectId } from "zod-mongodb-schema";
