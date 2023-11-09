import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  db.collection("jobs").updateMany(
    {
      type: "cron",
    },
    {
      $set: { status: "active" },
      $unset: ["sync"],
    }
  );
  db.collection("jobs").updateMany(
    {
      type: "cron_task",
    },
    {
      $unset: ["sync"],
    }
  );
};

export const down = async (_db: Db, _client: MongoClient) => {};
