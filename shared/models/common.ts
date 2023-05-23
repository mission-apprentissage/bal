import { CreateIndexesOptions, IndexSpecification } from "mongodb";

export interface IModelDescriptor {
  schema: unknown;
  indexes: [IndexSpecification, CreateIndexesOptions][];
  collectionName: string;
}
