import { useMongo } from "@tests/utils/mongo.utils"
import type { IJobsSimple } from "job-processor"
import { ObjectId } from "mongodb"
import type { IMailingListV2 } from "shared/models/mailingListV2.model"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { getTrainingLinks } from "@/common/apis/lba"
import { sendEmail } from "@/common/services/mailer/mailer"
import { getDbCollection } from "@/common/utils/mongodbUtils"
import { processMailingList } from "@/modules/jobs/mailing-list/mailing-list.processor"

vi.mock("@/common/apis/lba", () => ({
  getTrainingLinks: vi.fn(),
}))

vi.mock("@/common/services/mailer/mailBouncer", () => ({
  verifyEmails: vi.fn(async () => []),
}))

vi.mock("@/common/services/mailer/mailer", () => ({
  sendEmail: vi.fn(),
}))

const mongo = useMongo()

beforeAll(async () => {
  await mongo.beforeAll()
})

beforeEach(async () => {
  await mongo.beforeEach()
})

afterAll(async () => {
  await mongo.afterAll()
})

const now = new Date("2026-08-20T00:00:00.000Z")
const ttl = new Date("2026-09-20T00:00:00.000Z")

function buildMailingList(id: ObjectId, jobId: ObjectId, addedBy: ObjectId): IMailingListV2 {
  return {
    _id: id,
    name: "Liste de test",
    source: {
      file: { hash_fichier: "hash", delimiter: ",", size: 100, encoding: "utf8" },
      lines: 1,
      columns: ["email", "cle"],
    },
    config: {
      email_column: "email",
      output_columns: [{ input: { type: "computed", name: "WEBHOOK_LBA" }, output: "WEBHOOK_LBA", simple: true }],
      lba_columns: {
        cle_ministere_educatif: "cle",
        mef: "",
        cfd: "",
        rncp: "",
        code_postal: "",
        uai_formateur: "",
        uai_formateur_responsable: "",
        code_insee: "",
      },
    },
    status: "generate:scheduled",
    error: null,
    eta: null,
    generation_started_at: null,
    generation_ended_at: null,
    bounce_refresh_notified_at: null,
    progress: { parse: 100, generate: 0, export: 0 },
    output: { lines: 0, empty_source_lines: 0, blacklisted_email_count: 0, invalid_email_count: 0, duplicate_email_count: 0 },
    job_id: jobId,
    ttl,
    encode_key: "encode-key",
    added_by: addedBy,
    updated_at: now,
    created_at: now,
  }
}

describe("processMailingList", () => {
  it("should notify the owner once on failure, and not again when the job is replayed", async () => {
    const mailingListId = new ObjectId()
    const jobId = new ObjectId()
    const userId = new ObjectId()

    await getDbCollection("users").insertOne({
      _id: userId,
      email: "owner@exemple.fr",
      password: "hashed",
      is_admin: false,
      is_support: false,
      api_key: null,
      api_key_used_at: null,
      updated_at: now,
      created_at: now,
    })
    await getDbCollection("mailingListsV2").insertOne(buildMailingList(mailingListId, jobId, userId))
    await getDbCollection("mailingList.source").insertOne({
      _id: new ObjectId(),
      mailing_list_id: mailingListId,
      line_number: 1,
      data: { email: "a@exemple.fr", cle: "cle-1" },
      ttl,
    })

    vi.mocked(getTrainingLinks).mockRejectedValue(new Error("LBA est indisponible"))

    const job = { _id: jobId, payload: { id: mailingListId } } as unknown as IJobsSimple

    // Premier échec : transition generate:scheduled → generate:failure, un email est envoyé
    await expect(processMailingList(job, new AbortController().signal)).rejects.toThrow("LBA est indisponible")

    expect(sendEmail).toHaveBeenCalledTimes(1)
    expect(vi.mocked(sendEmail).mock.calls[0][0]).toEqual({
      name: "mailing_list_failure",
      to: "owner@exemple.fr",
      mailingListId: mailingListId.toString(),
      mailingListName: "Liste de test",
      error: "LBA est indisponible",
    })

    const failed = await getDbCollection("mailingListsV2").findOne({ _id: mailingListId })
    expect(failed?.status).toBe("generate:failure")
    expect(failed?.job_id).toBeNull()

    // Rejeu du même job (reprise après pause/récupération) : le statut est déjà en échec,
    // aucun nouvel email ne doit partir
    await expect(processMailingList(job, new AbortController().signal)).rejects.toThrow()

    expect(sendEmail).toHaveBeenCalledTimes(1)
  })
})
