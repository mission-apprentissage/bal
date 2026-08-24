import type { IJobsCronTask } from "job-processor"
import { getProcessorStatus } from "job-processor"
import type { ObjectId } from "mongodb"
import type { IMailingListV2 } from "shared/models/mailingListV2.model"

import logger from "../../../common/logger"
import { verifyEmails } from "../../../common/services/mailer/mailBouncer"
import { getDbCollection } from "../../../common/utils/mongodbUtils"
import { sendMailingListRefreshAvailableNotification } from "../mailing-list/mailing-list.notifications"

const CHUNK_SIZE = 500

// Les vérifications SMTP sont sensibles à la concurrence (réputation IP, greylisting) :
// on ne relance les emails en erreur que quand aucun autre traitement n'est en cours
async function isProcessorBusy(currentJob: IJobsCronTask | undefined): Promise<boolean> {
  const status = await getProcessorStatus()

  const hasOtherRunningTask = status.workers.some((worker) => {
    const task = worker.task
    if (!task) {
      return false
    }
    return currentJob == null || !task._id.equals(currentJob._id)
  })

  if (hasOtherRunningTask) {
    return true
  }

  return status.queue.some((job) => job.name === "mailing-list:process" || job.name === "email:verify")
}

export async function retryBouncerErrorEmails(signal: AbortSignal, currentJob?: IJobsCronTask): Promise<void> {
  // Emails déjà traités pendant ce run : ceux qui retombent en erreur sont ré-insérés dans le
  // cache par verifyEmails avec un nouvel _id (donc au-delà du curseur), il ne faut pas les repêcher
  const processed = new Set<string>()
  // Pagination par curseur : chaque page relit CHUNK_SIZE documents au plus, sans rescanner les précédents
  let lastId: ObjectId | null = null
  let retriedCount = 0

  while (!signal.aborted) {
    if (await isProcessorBusy(currentJob)) {
      logger.info({ retriedCount }, "retryBouncerErrorEmails: un autre traitement est en cours, arrêt")
      return
    }

    const errorDocs = await getDbCollection("bouncer.email")
      .find({ "ping.status": "error", ...(lastId === null ? {} : { _id: { $gt: lastId } }) }, { projection: { email: 1 }, signal })
      .sort({ _id: 1 })
      .limit(CHUNK_SIZE)
      .toArray()

    if (errorDocs.length === 0) {
      break
    }

    lastId = errorDocs[errorDocs.length - 1]._id

    const emails = errorDocs.map((doc) => doc.email).filter((email) => !processed.has(email))

    if (emails.length === 0) {
      continue
    }

    emails.forEach((email) => processed.add(email))

    // On supprime les entrées en erreur pour que verifyEmails re-vérifie réellement
    // (il court-circuite sinon sur le cache). En cas de nouvel échec, l'entrée est ré-insérée
    // avec un TTL court par persistPingResultCache.
    // Le driver n'accepte pas d'AbortSignal sur les écritures : on vérifie l'annulation juste avant
    signal.throwIfAborted()
    await getDbCollection("bouncer.email").deleteMany({ email: { $in: emails }, "ping.status": "error" })

    const results = await verifyEmails(emails, signal)
    retriedCount += results.length
  }

  logger.info({ retriedCount }, "retryBouncerErrorEmails: terminé")

  // La file d'erreurs est vidée : « le maximum a été fait ». On prévient les créateurs
  // des listes exportées dont au moins un email en erreur a été résolu depuis l'export.
  if (!signal.aborted) {
    await notifyRefreshableMailingLists(signal)
  }
}

async function hasResolvedBounceErrors(mailingList: IMailingListV2, signal: AbortSignal): Promise<boolean> {
  // Curseur borné en mémoire (une liste peut avoir des centaines de milliers de lignes en erreur,
  // un distinct() les matérialiserait toutes) avec sortie au premier email résolu
  const cursor = getDbCollection("mailingList.computed").find({ mailing_list_id: mailingList._id, "data.bounce_status": "error" }, { projection: { email: 1 }, signal })

  let batch = new Set<string>()

  const batchHasResolvedEmail = async (): Promise<boolean> => {
    if (batch.size === 0) {
      return false
    }

    const emails = Array.from(batch)
    batch = new Set()

    const resolvedCount = await getDbCollection("bouncer.email").countDocuments({ email: { $in: emails }, "ping.status": { $ne: "error" } })
    return resolvedCount > 0
  }

  for await (const doc of cursor) {
    signal.throwIfAborted()
    batch.add(doc.email)

    if (batch.size >= CHUNK_SIZE && (await batchHasResolvedEmail())) {
      return true
    }
  }

  return batchHasResolvedEmail()
}

async function notifyRefreshableMailingLists(signal: AbortSignal): Promise<void> {
  const cursor = getDbCollection("mailingListsV2").find({ status: "export:success", job_id: null, bounce_refresh_notified_at: null }, { signal })

  for await (const mailingList of cursor) {
    signal.throwIfAborted()

    if (!(await hasResolvedBounceErrors(mailingList, signal))) {
      continue
    }

    await sendMailingListRefreshAvailableNotification(mailingList)
    await getDbCollection("mailingListsV2").updateOne({ _id: mailingList._id }, { $set: { bounce_refresh_notified_at: new Date(), updated_at: new Date() } })
  }
}
