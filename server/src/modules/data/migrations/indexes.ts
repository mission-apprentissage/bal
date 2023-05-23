import logger from "../../../utils/logger";
import { createIndexes, dropIndexes } from "../../../utils/mongodb";

export const recreateIndexes = async ({ drop } = { drop: false }) => {
  if (drop) {
    logger.info("Drop all existing indexes...");
    await dropIndexes();
  }
  logger.info("Create all indexes...");
  await createIndexes();
  logger.info("All indexes successfully created !");
};
