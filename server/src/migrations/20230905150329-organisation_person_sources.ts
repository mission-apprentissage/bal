import type { Db, MongoClient } from "mongodb";

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
    ],
    {
      bypassDocumentValidation: true,
    }
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
    ],
    {
      bypassDocumentValidation: true,
    }
  );
};

export const down = async (db: Db, _client: MongoClient) => {
  await db.collection("organisations").updateMany(
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
    ],
    {
      bypassDocumentValidation: true,
    }
  );

  await db.collection("persons").updateMany(
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
    ],
    {
      bypassDocumentValidation: true,
    }
  );
};
