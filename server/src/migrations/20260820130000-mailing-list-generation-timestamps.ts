import { getDbCollection } from "../common/utils/mongodbUtils"

export const up = async () => {
  console.log("starting 20260820130000-mailing-list-generation-timestamps")

  await getDbCollection("mailingListsV2").updateMany({ generation_started_at: { $exists: false } }, { $set: { generation_started_at: null } }, { bypassDocumentValidation: true })
  await getDbCollection("mailingListsV2").updateMany({ generation_ended_at: { $exists: false } }, { $set: { generation_ended_at: null } }, { bypassDocumentValidation: true })

  console.log("ended 20260820130000-mailing-list-generation-timestamps")
}

export const requireShutdown: boolean = true
