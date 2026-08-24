import type { AnyBulkWriteOperation } from "mongodb"
import type { IMailingListComputedDatum } from "shared/models/mailingList.computed.model"
import type { IMailingListV2 } from "shared/models/mailingListV2.model"

import { getDbCollection } from "../../../common/utils/mongodbUtils"
import { toBounceColumns } from "./bouncer-columns"

const BATCH_SIZE = 1_000

// Répercute dans les lignes calculées de la liste les résolutions du cache bouncer.email
// (alimenté par le cron « Re-vérification des emails en erreur ») : les lignes restées en
// bounce_status "error" à la génération récupèrent leur statut affiné au (re-)export.
export async function refreshBouncerStatuses(mailingList: IMailingListV2, signal: AbortSignal): Promise<number> {
  const cursor = getDbCollection("mailingList.computed").find({ mailing_list_id: mailingList._id, "data.bounce_status": "error" }, { projection: { email: 1 }, signal })

  let refreshedCount = 0
  let batch = new Set<string>()

  const flush = async (): Promise<void> => {
    if (batch.size === 0) {
      return
    }

    const emails = Array.from(batch)
    batch = new Set()

    const resolvedDocs = await getDbCollection("bouncer.email")
      .find({ email: { $in: emails }, "ping.status": { $ne: "error" } }, { projection: { email: 1, ping: 1 }, signal })
      .toArray()

    if (resolvedDocs.length === 0) {
      return
    }

    signal.throwIfAborted()

    const operations: AnyBulkWriteOperation<IMailingListComputedDatum>[] = resolvedDocs.map((doc) => ({
      updateMany: {
        filter: { mailing_list_id: mailingList._id, email: doc.email, "data.bounce_status": "error" },
        update: {
          $set: Object.fromEntries(Object.entries(toBounceColumns(doc.ping)).map(([column, value]) => [`data.${column}`, value])),
        },
      },
    }))

    const result = await getDbCollection("mailingList.computed").bulkWrite(operations, { ordered: false })
    refreshedCount += result.modifiedCount
  }

  for await (const doc of cursor) {
    signal.throwIfAborted()
    batch.add(doc.email)

    if (batch.size >= BATCH_SIZE) {
      await flush()
    }
  }

  await flush()

  return refreshedCount
}
