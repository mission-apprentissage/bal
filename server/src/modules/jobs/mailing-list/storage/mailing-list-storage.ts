import type { Readable } from "stream";
import type { ObjectId } from "mongodb";
import { notFound } from "@hapi/boom";
import { getStepCompletion } from "shared/mailing-list/mailing-list.utils";
import { deleteFromStorage, getFromStorage } from "../../../../common/utils/ovhUtils";
import { decipher } from "../../../../common/utils/cryptoUtils";
import { getDbCollection } from "../../../../common/utils/mongodbUtils";

export function getMailingListStoragePath(mailingListId: ObjectId): {
  source: string;
  result: string;
  account: "main";
} {
  return {
    source: `mailing-lists/${mailingListId.toString()}/source.csv`,
    result: `mailing-lists/${mailingListId.toString()}/result.csv`,
    account: "main",
  };
}

export async function downloadMailingListFile(
  mailingListId: ObjectId,
  type: "source" | "result",
  signal: AbortSignal
): Promise<{ stream: Readable; headers: Record<string, string> }> {
  const { source, result, account } = getMailingListStoragePath(mailingListId);

  const mailingList = await getDbCollection("mailingListsV2").findOne({
    _id: mailingListId,
  });

  if (!mailingList) {
    throw notFound("La liste de diffusion n'existe pas");
  }

  const path = type === "source" ? source : result;

  const steps = getStepCompletion(mailingList);

  if (type === "source" && !steps.upload) {
    throw notFound("Le fichier source n'existe pas");
  }

  if (type === "result" && !steps.export) {
    throw notFound("Le fichier résultat n'existe pas");
  }

  const encryptedStream = await getFromStorage(path, account, signal);
  const fileName = `${mailingList.name}${type === "source" ? "-source" : ""}.csv`;

  return {
    stream: encryptedStream.pipe(decipher(mailingList.encode_key)),
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  };
}

export async function deleteMailingListFile(mailingListId: ObjectId, type: "source" | "result") {
  const { source, result, account } = getMailingListStoragePath(mailingListId);

  await deleteFromStorage(type === "source" ? source : result, account);
}
