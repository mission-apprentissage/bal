import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  await db.dropCollection("brevo.listes");
  await db.dropCollection("brevo.contacts");
};
