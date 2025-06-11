import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("persons").updateMany(
    { organisation: { $exists: true } },
    { $unset: { organisation: true } },
    {
      bypassDocumentValidation: true,
    }
  );
};

export const down = async (_db: Db, _client: MongoClient) => {};
