import { MongoMemoryServer } from "mongodb-memory-server";

import {
  closeMongodbConnection,
  connectToMongodb,
  getDatabase,
} from "@/utils/mongodbUtils";

let mongoInMemory: MongoMemoryServer;

export const startAndConnectMongodb = async () => {
  mongoInMemory = await MongoMemoryServer.create();
  const uri = mongoInMemory.getUri();
  await connectToMongodb(uri);
};

export const stopMongodb = async () => {
  await closeMongodbConnection();
  await mongoInMemory.stop();
};

export const clearAllCollections = async () => {
  const collections = await getDatabase().collections();
  return Promise.all(collections.map((c) => c.deleteMany({})));
};
