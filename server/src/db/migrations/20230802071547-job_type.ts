import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("jobs").updateMany(
    {},
    [
      {
        $set: {
          type: "simple",
          scheduled_for: {
            $ifNull: ["$scheduled_at", "$started_at", "$created_at", "$$NOW"],
          },
        },
      },
      {
        $unset: ["scheduled_at"],
      },
    ],
    {
      bypassDocumentValidation: true,
    }
  );
};
