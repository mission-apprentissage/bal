import { Db, MongoClient } from "mongodb";

import { getDbCollection } from "../common/utils/mongodbUtils";

export const up = async (_db: Db, _client: MongoClient) => {
  await getDbCollection("bouncer.domain").deleteMany({
    "ping.status": { $in: ["error", "not_supported"] },
  });
};
