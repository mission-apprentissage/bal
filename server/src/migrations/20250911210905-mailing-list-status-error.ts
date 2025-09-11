import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async () => {
  await getDbCollection("mailingListsV2").updateMany(
    { error: { $exists: false } },
    { $set: { error: null } },
    { bypassDocumentValidation: true }
  );
  await getDbCollection("mailingListsV2").updateMany(
    { eta: { $exists: false } },
    { $set: { eta: null } },
    { bypassDocumentValidation: true }
  );
};

export const requireShutdown: boolean = true;
