import { Db, MongoClient } from "mongodb";

import { getDbCollection } from "../../common/utils/mongodbUtils";

export const up = async (_db: Db, _client: MongoClient) => {
  await getDbCollection("decaHistory").deleteMany({
    key: /^_id\./,
  });
};
