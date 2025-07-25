import type { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("jobs").updateMany(
    {
      type: "simple",
    },
    {
      $unset: { cron_string: 1 },
    },
    {
      bypassDocumentValidation: true,
    }
  );
  await db.collection("jobs").updateMany(
    {
      type: "cron",
    },
    {
      $set: { status: "active" },
      $unset: { sync: 1 },
    },
    {
      bypassDocumentValidation: true,
    }
  );
  await db.collection("jobs").updateMany(
    {
      type: "cron_task",
    },
    {
      $unset: { sync: 1, cron_string: 1 },
    },
    {
      bypassDocumentValidation: true,
    }
  );
};

export const down = async (_db: Db, _client: MongoClient) => {};
