import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  db.collection("decaHistory").updateMany(
    {},
    { $unset: { resumeToken: 1, created_at: 1 } },
    { bypassDocumentValidation: true }
  );

  db.collection("deca").updateMany({}, [
    {
      $set: {
        "alternant.adresse.numero": { $toString: "$alternant.adresse.numero" },
        "alternant.derniere_classe": { $toString: "$alternant.derniere_classe" },
        "alternant.sexe": { $toString: "$alternant.sexe" },
      },
    },
  ]);
};

export const down = async (_db: Db, _client: MongoClient) => {};
