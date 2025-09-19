import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async () => {
  await getDbCollection("mailingListsV2").updateMany(
    { "source.file.encoding": { $exists: false } },
    { $set: { "source.file.encoding": "utf8" } },
    { bypassDocumentValidation: true }
  );
};

export const requireShutdown: boolean = true;
