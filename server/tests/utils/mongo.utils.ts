import { MongoMemoryServer } from "mongodb-memory-server";

import { closeMongodbConnection, connectToMongodb } from "../../src/db/mongodb";

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
