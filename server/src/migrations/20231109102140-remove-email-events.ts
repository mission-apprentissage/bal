import type { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  // Removes all emails events
  await db.collection("events").deleteMany({});
};

export const down = async (_db: Db, _client: MongoClient) => {};
