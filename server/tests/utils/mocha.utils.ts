import { startAndConnectMongodb, stopMongodb } from "./mongo.utils";

// connect to mongodb and create indexes before running tests
export const mochaGlobalSetup = async () => {
  await startAndConnectMongodb();
};

// close mongo connection when all tests have been run
export const mochaGlobalTeardown = async () => {
  await stopMongodb();
};
