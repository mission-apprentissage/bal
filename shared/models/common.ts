import type { CreateIndexesOptions, IndexSpecification } from "mongodb";
import type { $ZodType } from "zod/v4/core";

export type CollectionName =
  | "users"
  | "organisations"
  | "persons"
  | "events"
  | "sessions"
  | "mailingListsV2"
  | "mailingList.source"
  | "mailingList.computed"
  | "emailDenied"
  | "deca"
  | "anonymized.deca"
  | "decaHistory"
  | "deca.import.job.result"
  | "deca.import.job.result.specific"
  | "bouncer.email"
  | "bouncer.domain"
  | "lba.emailblacklists";

export interface IModelDescriptor {
  zod: $ZodType;
  indexes: [IndexSpecification, CreateIndexesOptions][];
  collectionName: CollectionName;
}

export { zObjectIdMini as zObjectId } from "zod-mongodb-schema";
