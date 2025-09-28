import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async () => {
  console.log("starting 20250919224512-csv-encoding");

  await getDbCollection("mailingListsV2").updateMany(
    { "source.file.encoding": { $exists: false } },
    { $set: { "source.file.encoding": "utf8" } },
    { bypassDocumentValidation: true }
  );

  console.log("ended 20250919224512-csv-encoding");
};

export const requireShutdown: boolean = true;
