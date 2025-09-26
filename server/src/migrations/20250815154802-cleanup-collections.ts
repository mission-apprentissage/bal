//import type { Db } from "mongodb";
import { modelDescriptors } from "shared/models/models";
import { getCollectionList } from "../common/utils/mongodbUtils";

export const up = async (/*db: Db*/) => {
  const collections = await getCollectionList();
  const expectedCollections = new Set([
    ...modelDescriptors.map((model): string => model.collectionName),
    "migrations",
    "job_processor.jobs",
    "job_processor.workers",
  ]);

  const collectionsToDrop = collections
    .filter((c) => !expectedCollections.has(c.name))
    .map((c) => c.name)
    .toSorted();

  for (const collectionName of collectionsToDrop) {
    console.log(`Dropping collection: ${collectionName}`);
    //await db.collection(collectionName).drop();
  }
};

export const requireShutdown: boolean = true;
