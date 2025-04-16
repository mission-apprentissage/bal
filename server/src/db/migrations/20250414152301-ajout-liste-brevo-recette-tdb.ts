import { Db, MongoClient, ObjectId } from "mongodb";

export const up = async (_db: Db, _client: MongoClient) => {
  const db = _db.collection("brevo.listes");

  await db.insertOne({
    _id: new ObjectId(),
    listId: 522,
    product: "tdb",
    env: "recette",
    nom: "2703 - RECETTE Rupturant - Contact ML",
    created_at: new Date(),
  });

  await db.insertOne({
    _id: new ObjectId(),
    listId: 521,
    product: "tdb",
    env: "production",
    nom: "2703 - PRODUCTION Rupturant - Contact ML",
    created_at: new Date(),
  });
};
