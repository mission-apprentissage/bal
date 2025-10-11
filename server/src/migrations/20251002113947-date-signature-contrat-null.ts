import type { Db } from "mongodb";
import logger from "../common/logger";

export const up = async (db: Db) => {
  logger.info("Migration 20251002113947-date-signature-contrat-null started");
  await db
    .collection("deca")
    .updateMany({}, { $set: { date_signature_contrat: null } }, { bypassDocumentValidation: true });

  logger.info("Migration 20251002113947-date-signature-contrat-null completed");
};

export const requireShutdown: boolean = false;
