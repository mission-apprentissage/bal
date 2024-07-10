import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  db.collection("decaHistory").updateMany(
    {},
    { $unset: { resumeToken: 1, created_at: 1 } },
    { bypassDocumentValidation: true }
  );

  await db.collection("deca").updateMany(
    { "alternant.sexe": { $in: ["1", 1, "2", 2] } },
    [
      {
        $set: {
          "alternant.sexe": {
            $cond: {
              if: { $or: [{ $eq: ["$alternant.sexe", "1"] }, { $eq: ["$alternant.sexe", 1] }] },
              then: "H",
              else: {
                $cond: {
                  if: { $or: [{ $eq: ["$alternant.sexe", "2"] }, { $eq: ["$alternant.sexe", 2] }] },
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
    { rupture_avant_debut: null },
    [
      {
        $set: {
          rupture_avant_debut: false,
        },
      },
    ],
    { bypassDocumentValidation: true }
  );

  await db.collection("deca").updateMany(
    { "employeur.nombre_de_salaries": 0 },
    [
      {
        $set: {
          "employeur.nombre_de_salaries": null,
        },
      },
    ],
    { bypassDocumentValidation: true }
  );

  await db.collection("deca").updateMany(
    { "alternant.adresse.numero": "0" },
    [
      {
        $set: {
          "alternant.adresse.numero": null,
        },
      },
    ],
    { bypassDocumentValidation: true }
  );

  await db.collection("deca").updateMany(
    { "alternant.handicap": null },
    [
      {
        $set: {
          "alternant.handicap": false,
        },
      },
    ],
    { bypassDocumentValidation: true }
  );
};

export const down = async (_db: Db, _client: MongoClient) => {};
