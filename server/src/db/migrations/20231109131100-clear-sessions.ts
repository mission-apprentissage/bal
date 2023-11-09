import { Db, MongoClient } from "mongodb";

export const up = async (db: Db, _client: MongoClient) => {
  db.collection("sessions").deleteMany({});
};

export const down = async (_db: Db, _client: MongoClient) => {};
