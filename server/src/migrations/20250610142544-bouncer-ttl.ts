import { Db, MongoClient } from "mongodb";

import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async (_db: Db, _client: MongoClient) => {
  await getDbCollection("bouncer.email").updateMany(
    {
      "ping.status": "invalid",
    },
    {
      $set: {
        ttl: null,
      },
    },
    { bypassDocumentValidation: true }
  );

  await getDbCollection("bouncer.email").updateMany(
    {
      "ping.status": { $ne: "invalid" },
    },
    {
      $set: {
        ttl: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Set TTL to 30 days from now
      },
    },
    { bypassDocumentValidation: true }
  );
};
