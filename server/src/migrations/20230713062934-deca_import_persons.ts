import { Db, MongoClient } from "mongodb";

import { importDecaContent } from "../modules/actions/deca.actions";

export const up = async (db: Db, _client: MongoClient) => {
  // transform organisation_id to organisations
  const persons = await db
    .collection("persons")
    .find({ organisation_id: { $exists: true, $ne: "" } })
    .toArray();

  for (const person of persons) {
    await db.collection("persons").updateOne(
      { _id: person._id },
      {
        $set: { organisations: [person.organisation_id] },
        $unset: { organisation_id: "" },
      }
    );
  }

  // create persons
  const documentContentsCursor = db.collection("documentContents").find({ type_document: "DECA" });

  let batch = [];
  for await (const documentContent of documentContentsCursor) {
    batch.push(importDecaContent(documentContent.content.emails, documentContent.content.siret));

    if (batch.length > 10_000) {
      await Promise.all(batch);
      batch = [];
    }
  }
};

export const down = async (_db: Db, _client: MongoClient) => {};
