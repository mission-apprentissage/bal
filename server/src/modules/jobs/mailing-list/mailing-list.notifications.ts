import type { IMailingListV2 } from "shared/models/mailingListV2.model"

import logger from "../../../common/logger"
import { sendEmail } from "../../../common/services/mailer/mailer"
import { getDbCollection } from "../../../common/utils/mongodbUtils"

async function getMailingListOwnerEmail(mailingList: IMailingListV2): Promise<string | null> {
  const user = await getDbCollection("users").findOne({ _id: mailingList.added_by })

  if (!user) {
    logger.warn({ mailingListId: mailingList._id, addedBy: mailingList.added_by }, "mailing-list notification: utilisateur créateur introuvable")
    return null
  }

  return user.email
}

export async function sendMailingListSuccessNotification(mailingList: IMailingListV2): Promise<void> {
  const to = await getMailingListOwnerEmail(mailingList)

  if (!to) {
    return
  }

  // sendEmail ne throw jamais : aucun risque de faire échouer le job
  await sendEmail({
    name: "mailing_list_success",
    to,
    mailingListId: mailingList._id.toString(),
    mailingListName: mailingList.name,
  })
}

export async function sendMailingListRefreshAvailableNotification(mailingList: IMailingListV2): Promise<void> {
  const to = await getMailingListOwnerEmail(mailingList)

  if (!to) {
    return
  }

  await sendEmail({
    name: "mailing_list_refresh_available",
    to,
    mailingListId: mailingList._id.toString(),
    mailingListName: mailingList.name,
  })
}

export async function sendMailingListFailureNotification(mailingList: IMailingListV2, error: string): Promise<void> {
  const to = await getMailingListOwnerEmail(mailingList)

  if (!to) {
    return
  }

  await sendEmail({
    name: "mailing_list_failure",
    to,
    mailingListId: mailingList._id.toString(),
    mailingListName: mailingList.name,
    error,
  })
}
