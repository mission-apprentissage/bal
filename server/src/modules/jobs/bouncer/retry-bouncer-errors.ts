import type { IJobsCronTask } from "job-processor"
import { getProcessorStatus } from "job-processor"

import logger from "../../../common/logger"
import { verifyEmails } from "../../../common/services/mailer/mailBouncer"
import { getDbCollection } from "../../../common/utils/mongodbUtils"

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
  // Emails déjà traités pendant ce run : ceux qui retombent en erreur sont ré-insérés
  // dans le cache par verifyEmails, il ne faut pas les repêcher en boucle
  const processed = new Set<string>()
  let retriedCount = 0

  while (!signal.aborted) {
    if (await isProcessorBusy(currentJob)) {
      logger.info({ retriedCount }, "retryBouncerErrorEmails: un autre traitement est en cours, arrêt")
      return
    }

    const errorDocs = await getDbCollection("bouncer.email")
      .find({ "ping.status": "error" }, { projection: { email: 1 }, signal })
      .limit(CHUNK_SIZE + processed.size)
      .toArray()

    const emails = errorDocs.map((doc) => doc.email).filter((email) => !processed.has(email))

    if (emails.length === 0) {
      break
    }

    const chunk = emails.slice(0, CHUNK_SIZE)
    chunk.forEach((email) => processed.add(email))

    // On supprime les entrées en erreur pour que verifyEmails re-vérifie réellement
    // (il court-circuite sinon sur le cache). En cas de nouvel échec, l'entrée est ré-insérée
    // avec un TTL court par persistPingResultCache.
    await getDbCollection("bouncer.email").deleteMany({ email: { $in: chunk }, "ping.status": "error" })

    const results = await verifyEmails(chunk, signal)
    retriedCount += results.length
  }

  logger.info({ retriedCount }, "retryBouncerErrorEmails: terminé")
}
