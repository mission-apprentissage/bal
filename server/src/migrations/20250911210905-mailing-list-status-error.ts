import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async () => {
  console.log("starting 20250911210905-mailing-list-status-error")
  
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
  
  console.log("ended 20250911210905-mailing-list-status-error")
};

export const requireShutdown: boolean = true;
