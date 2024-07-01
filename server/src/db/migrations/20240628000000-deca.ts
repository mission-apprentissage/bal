import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  db.collection("decaHistory").updateMany(
    {},
    { $unset: { resumeToken: 1, created_at: 1 } },
    { bypassDocumentValidation: true }
  );

  const command = {
    aggregate: "deca",
    pipeline: [
      {
        $addFields: {
          "alternant.derniere_classe": {
            $toString: "$alternant.derniere_classe",
          },
          "alternant.sexe": {
            $toString: "$alternant.sexe",
          },
        },
      },
      {
        $merge: {
          into: "deca",
          whenMatched: "merge",
          whenNotMatched: "fail",
        },
      },
    ],
    cursor: {},
    bypassDocumentValidation: true,
  };

  await _client.db("mna-bal").command(command);

  await db.collection("deca").updateMany(
    { "alternant.sexe": { $in: ["1", "2"] } },
    [
      {
        $set: {
          "alternant.sexe": {
            $cond: {
              if: { $eq: ["$alternant.sexe", "1"] },
              then: "H",
              else: {
                $cond: {
                  if: { $eq: ["$alternant.sexe", "2"] },
                  then: "F",
                  else: "$alternant.sexe",
                },
              },
            },
          },
        },
      },
    ],
    { bypassDocumentValidation: true }
  );

  await db.collection("deca").updateMany(
    { "alternant.derniere_classe": "1" },
    [
      {
        $set: {
          "alternant.derniere_classe": "01",
        },
      },
    ],
    { bypassDocumentValidation: true }
  );
};

export const down = async (_db: Db, _client: MongoClient) => {};
