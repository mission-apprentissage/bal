import { getDbCollection } from "../../../common/utils/mongodbUtils";

export const clear = async () => {
  await clearUsersRelated();
  await clearDocumentsRelated();
  await clearJobsRelated();
};

export const clearUsersRelated = async () => {
  await getDbCollection("users").deleteMany({});
  await getDbCollection("organisations").deleteMany({});
  await getDbCollection("persons").deleteMany({});
  await getDbCollection("sessions").deleteMany({});
};
export const clearDocumentsRelated = async () => {
  await getDbCollection("documents").deleteMany({});
  await getDbCollection("documentContents").deleteMany({});
};

export const clearJobsRelated = async () => {
  await getDbCollection("jobs").deleteMany({});
  await getDbCollection("events").deleteMany({});
};
