import type { Db } from "mongodb";
import { deleteFromStorage, listFromStorage } from "../common/utils/ovhUtils";

export const up = async (db: Db) => {
  await db
    .collection("mailingLists")
    .drop()
    .catch((e) => {
      if (e.codeName !== "NamespaceNotFound") {
        throw e;
      }
    });
  await db
    .collection("documentContents")
    .drop()
    .catch((e) => {
      if (e.codeName !== "NamespaceNotFound") {
        throw e;
      }
    });
  await db
    .collection("documents")
    .drop()
    .catch((e) => {
      if (e.codeName !== "NamespaceNotFound") {
        throw e;
      }
    });

  const supportFiles = await listFromStorage("support");
  for (const file of supportFiles) {
    await deleteFromStorage(file.name, "support");
  }

  const mainFiles = await listFromStorage("main");
  for (const file of mainFiles) {
    await deleteFromStorage(file.name, "main");
  }
};

export const requireShutdown: boolean = true;
