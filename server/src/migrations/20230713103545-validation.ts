import type { Db, MongoClient } from "mongodb";

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

  const personCursor = db.collection("persons").find({});

  for await (const person of personCursor) {
    const organisations = await db
      .collection("organisations")
      .find({
        email_domains: person.email.split("@")[1],
      })
      .toArray();
    await db.collection("persons").updateOne(
      { _id: person._id },
      { $set: { organisation: organisations.map((o) => o._id.toString()) } },
      {
        bypassDocumentValidation: true,
      }
    );
  }
};
