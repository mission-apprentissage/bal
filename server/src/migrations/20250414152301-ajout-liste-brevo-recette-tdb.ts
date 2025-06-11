import { Db, ObjectId } from "mongodb";

import config from "../../config";

export const up = async (db: Db) => {
  const brevoListeCollection = db.collection("brevo.listes");
  const currentDate = new Date();

  if (config.env === "production") {
    await brevoListeCollection.insertOne({
      _id: new ObjectId(),
      listId: 521,
      product: "tdb",
      env: "production",
      nom: "2703 - PRODUCTION Rupturant - Contact ML",
      created_at: currentDate,
      updated_at: currentDate,
    });
  }

  if (config.env === "recette") {
    await brevoListeCollection.insertOne({
      _id: new ObjectId(),
      listId: 522,
      product: "tdb",
      env: "recette",
      nom: "2703 - RECETTE Rupturant - Contact ML",
      created_at: currentDate,
      updated_at: currentDate,
    });
  }
};
