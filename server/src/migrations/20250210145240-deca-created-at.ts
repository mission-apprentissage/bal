import type { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("deca").updateMany(
    {
      created_at: null,
    },
    [{ $set: { created_at: { $toDate: "$_id" } } }],
    { bypassDocumentValidation: true }
  );
  await db.collection("deca").updateMany(
    {
      updated_at: null,
    },
    [{ $set: { updated_at: "$created_at" } }],
    { bypassDocumentValidation: true }
  );
};
