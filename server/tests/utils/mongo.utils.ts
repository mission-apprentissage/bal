import {
  clearAllCollections,
  closeMongodbConnection,
  configureDbSchemaValidation,
  connectToMongodb,
  createIndexes,
  getDatabase,
} from "@/common/utils/mongodbUtils";
import config from "@/config";
import { modelDescriptors } from "@/db/models";

export const startAndConnectMongodb = async () => {
  const workerId = `${process.env.VITEST_POOL_ID}-${process.env.VITEST_WORKER_ID}`;

  await connectToMongodb(
    config.mongodb.uri.replace("VITEST_POOL_ID", workerId)
  );
  await createIndexes();
  await configureDbSchemaValidation(modelDescriptors);
};

export const stopMongodb = async () => {
  await getDatabase().dropDatabase();
  await closeMongodbConnection();
};

export const useMongo = () => {
  return {
    beforeAll: async () => {
      await startAndConnectMongodb();
    },

    afterAll: async () => {
      await stopMongodb();
    },

    beforeEach: async () => {
      await clearAllCollections();
    },
  };
};
