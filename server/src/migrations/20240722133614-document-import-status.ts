import type { Db, MongoClient } from "mongodb";

import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async (_db: Db, _client: MongoClient) => {
  await getDbCollection("documents").updateMany(
    {
      job_status: "pending",
      job_id: null,
      created_at: { $lte: new Date(Date.now() - 24 * 3600 * 1000) },
    },
    {
      $set: {
        job_status: "error",
      },
    }
  );
};
