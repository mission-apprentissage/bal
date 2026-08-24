import { getDbCollection } from "../common/utils/mongodbUtils"

export const up = async () => {
  console.log("starting 20260824090000-mailing-list-output-refinements")

  await getDbCollection("mailingListsV2").updateMany(
    { "output.duplicate_email_count": { $exists: false } },
    { $set: { "output.duplicate_email_count": 0 } },
    { bypassDocumentValidation: true }
  )
  await getDbCollection("mailingListsV2").updateMany(
    { bounce_refresh_notified_at: { $exists: false } },
    { $set: { bounce_refresh_notified_at: null } },
    { bypassDocumentValidation: true }
  )

  console.log("ended 20260824090000-mailing-list-output-refinements")
}

export const requireShutdown: boolean = true
