import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.collection("users").updateMany(
    { person_id: { $type: "objectId" } },
    [
      {
        $set: {
          person_id: { $toString: "$person_id" },
        },
      },
    ],
    {
      bypassDocumentValidation: true,
    }
  );

  await db.collection("documents").updateMany(
    { confirm: { $exists: true } },
    { $unset: { confirm: true } },
    {
      bypassDocumentValidation: true,
    }
  );

  await db.collection("jobs").updateMany(
    {},
    [
      {
        $set: {
          output: {
            duration: "$payload.duration",
            result: "$payload.result",
            error: "$payload.error",
          },
        },
      },
      {
        $unset: ["payload.duration", "payload.result", "payload.error"],
      },
    ],
    {
      bypassDocumentValidation: true,
    }
  );

  const invalidPersonsCursor = db
    .collection("persons")
    .find({ organisation_id: null });

  for await (const person of invalidPersonsCursor) {
    const organisation = await db.collection("organisations").findOne({
      email_domains: person.email.split("@")[1],
    });
    if (organisation) {
      await db
        .collection("persons")
        .updateOne(
          { _id: person._id },
          { $set: { organisation_id: organisation.id.toString() } }
        );
    }
  }

  throw new Error("wesh");
};
