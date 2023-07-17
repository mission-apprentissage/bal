import { Db, MongoClient } from "mongodb";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";

import { importDecaContent } from "../../modules/actions/deca.actions";

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
  const documentContentsCursor = db
    .collection("documentContents")
    .find({ type_document: DOCUMENT_TYPES.DECA });

  for await (const documentContent of documentContentsCursor) {
    await importDecaContent(
      documentContent.content.emails,
      documentContent.content.siret
    );
  }
};

export const down = async (_db: Db, _client: MongoClient) => {};
