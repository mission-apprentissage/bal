import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("organisations").updateMany(
    {
      "_meta.source": { $exists: true, $ne: "" },
    },
    [
      {
        $set: {
          "_meta.sources": ["$_meta.source"],
        },
      },
      {
        $unset: "_meta.source",
      },
    ]
  );

  await db.collection("persons").updateMany(
    {
      "_meta.source": { $exists: true, $ne: "" },
    },
    [
      {
        $set: {
          "_meta.sources": ["$_meta.source"],
        },
      },
      {
        $unset: "_meta.source",
      },
    ]
  );
};

export const down = async (db: Db, _client: MongoClient) => {
  db.collection("organisations").updateMany(
    {
      "_meta.sources": { $exists: true },
    },
    [
      {
        $set: {
          "_meta.source": { $arrayElemAt: ["$_meta.sources", 0] },
        },
      },
      {
        $unset: "_meta.sources",
      },
    ]
  );

  db.collection("persons").updateMany(
    {
      "_meta.sources": { $exists: true },
    },
    [
      {
        $set: {
          "_meta.source": { $arrayElemAt: ["$_meta.sources", 0] },
        },
      },
      {
        $unset: "_meta.sources",
      },
    ]
  );
};
