import { getDbCollection } from "../../../common/utils/mongodbUtils";
import config from "../../../config";

export const clear = async () => {
  if (!["recette", "sandbox", "local"].includes(config.env)) {
    return;
  }

  await clearUsersRelated();
  await clearDocumentsRelated();
  await clearJobsRelated();
};

const clearUsersRelated = async () => {
  await getDbCollection("users").deleteMany({});
  await getDbCollection("organisations").deleteMany({});
  await getDbCollection("persons").deleteMany({});
  await getDbCollection("sessions").deleteMany({});
};

const clearDocumentsRelated = async () => {
  await getDbCollection("documents").deleteMany({});
  await getDbCollection("documentContents").deleteMany({});
};

const clearJobsRelated = async () => {
  await getDbCollection("jobs").deleteMany({});
  await getDbCollection("events").deleteMany({});
};
