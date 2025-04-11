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
  | "deca.import.job.result"
  | "catalogueEmailSirets"
  | "bouncer.email"
  | "bouncer.email.pending"
  | "bouncer.domain"
  | "lba.emailblacklists"
  | "lba.recruteurs.siret.email";

export interface IModelDescriptor {
  zod: ZodType;
  indexes: [IndexSpecification, CreateIndexesOptions][];
  collectionName: CollectionName;
}

export { zObjectId } from "zod-mongodb-schema";
