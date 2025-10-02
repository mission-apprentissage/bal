import type { Db } from "mongodb";

export const up = async (db: Db) => {
  await db
    .collection("deca")
    .updateMany({}, { $set: { date_signature_contrat: null } }, { bypassDocumentValidation: true });
};

export const requireShutdown: boolean = false;
