import { Db, ObjectId } from "mongodb";

export const up = async (db: Db) => {
  const brevoListeCollection = db.collection("brevo.listes");
  const currentDate = new Date();
  await brevoListeCollection.insertOne({
    _id: new ObjectId(),
    listId: 522,
    product: "tdb",
    env: "recette",
    nom: "2703 - RECETTE Rupturant - Contact ML",
    created_at: currentDate,
    updated_at: currentDate,
  });

  await brevoListeCollection.insertOne({
    _id: new ObjectId(),
    listId: 521,
    product: "tdb",
    env: "production",
    nom: "2703 - PRODUCTION Rupturant - Contact ML",
    created_at: currentDate,
    updated_at: currentDate,
  });
};
