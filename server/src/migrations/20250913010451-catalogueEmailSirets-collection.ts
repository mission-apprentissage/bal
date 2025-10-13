import type { Db } from "mongodb";

export const up = async (db: Db) => {
  await db.dropCollection("catalogueEmailSirets").catch((e) => {
    if (e.codeName !== "NamespaceNotFound") {
      throw e;
    }
  });
  await db.dropCollection("lba.recruteurs.siret.email").catch((e) => {
    if (e.codeName !== "NamespaceNotFound") {
      throw e;
    }
  });
};

export const requireShutdown: boolean = true;
