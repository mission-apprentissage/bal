import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("jobs").updateMany(
    {},
    [
      {
        $set: {
          type: "simple",
          scheduled_for: "$scheduled_at",
        },
      },
      {
        $unset: ["$scheduled_at"],
      },
    ],
    {
      bypassDocumentValidation: true,
    }
  );
};
