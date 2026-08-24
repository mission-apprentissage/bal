import { useMongo } from "@tests/utils/mongo.utils"
import type { IJobsSimple } from "job-processor"
import { ObjectId } from "mongodb"
import type { IMailingListV2 } from "shared/models/mailingListV2.model"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { getTrainingLinks } from "@/common/apis/lba"
import { verifyEmails } from "@/common/services/mailer/mailBouncer"
import { getDbCollection } from "@/common/utils/mongodbUtils"
import { generateMailingList } from "@/modules/jobs/mailing-list/generator/mailing-list-generator"

vi.mock("@/common/apis/lba", () => ({
  getTrainingLinks: vi.fn(),
}))

vi.mock("@/common/services/mailer/mailBouncer", () => ({
  verifyEmails: vi.fn(),
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

function buildMailingList(id: ObjectId, jobId: ObjectId): IMailingListV2 {
  return {
    _id: id,
    name: "Liste de test",
    source: {
      file: { hash_fichier: "hash", delimiter: ",", size: 100, encoding: "utf8" },
      lines: 5,
      columns: ["email", "nom", "cle"],
    },
    config: {
      email_column: "email",
      output_columns: [
        { input: { type: "source", name: "nom" }, output: "nom", simple: true },
        { input: { type: "computed", name: "BOUNCER" }, output: "BOUNCER", simple: true },
        { input: { type: "computed", name: "WEBHOOK_LBA" }, output: "WEBHOOK_LBA", simple: true },
      ],
      lba_columns: {
        cle_ministere_educatif: "cle",
        mef: "",
        cfd: "",
        rncp: "",
        code_postal: "",
        uai_lieu_formation: "",
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
    added_by: new ObjectId(),
    updated_at: now,
    created_at: now,
  }
}

async function insertSourceLines(mailingListId: ObjectId, emails: string[]): Promise<void> {
  await getDbCollection("mailingList.source").insertMany(
    emails.map((email, i) => ({
      _id: new ObjectId(),
      mailing_list_id: mailingListId,
      line_number: i + 1,
      data: { email, nom: `nom-${i + 1}`, cle: `cle-${i + 1}` },
      ttl,
    }))
  )
}

describe("generateMailingList", () => {
  it("should verify and enrich only lines with a valid non-blacklisted email", async () => {
    const mailingListId = new ObjectId()
    const jobId = new ObjectId()
    const mailingList = buildMailingList(mailingListId, jobId)

    await getDbCollection("mailingListsV2").insertOne(mailingList)
    // ligne 1: valide / ligne 2: invalide / ligne 3: vide / ligne 4: blacklistée / ligne 5: doublon de la ligne 1
    await insertSourceLines(mailingListId, ["a@exemple.fr", "not-an-email", "", "b@mail.fr", "a@exemple.fr"])
    await getDbCollection("lba.emailblacklists").insertOne({
      _id: new ObjectId(),
      email: "b@mail.fr",
      blacklisting_origin: "test",
      created_at: now,
      updated_at: now,
    })

    vi.mocked(verifyEmails).mockImplementation(async (emails) =>
      emails.map((email) => ({
        email,
        ping: { status: "valid" as const, message: "ok", responseCode: null, responseMessage: null },
      }))
    )
    vi.mocked(getTrainingLinks).mockImplementation(async (data) => data.map((item) => ({ id: item.id, lien_lba: `lba-${item.id}`, lien_prdv: `prdv-${item.id}` })))

    await generateMailingList(mailingList, { _id: jobId } as IJobsSimple, new AbortController().signal)

    // Le bouncer ne reçoit que l'email valide, dédupliqué
    expect(verifyEmails).toHaveBeenCalledTimes(1)
    expect(vi.mocked(verifyEmails).mock.calls[0][0]).toEqual(["a@exemple.fr"])

    // LBA ne reçoit que les lignes valides (1 et 5)
    expect(getTrainingLinks).toHaveBeenCalledTimes(1)
    expect(vi.mocked(getTrainingLinks).mock.calls[0][0].map((item) => item.id)).toEqual(["1", "5"])

    const computed = await getDbCollection("mailingList.computed").find({ mailing_list_id: mailingListId }).sort({ line_number: 1 }).toArray()

    expect(computed.map((line) => line.email_status)).toEqual(["valid", "invalid", "empty", "blacklisted", "valid"])
    expect(computed[0].data.lien_lba).toBe("lba-1")
    expect(computed[0].data.bounce_status).toBe("valid")
    expect(computed[4].data.lien_lba).toBe("lba-5")

    // Les lignes non valides gardent les valeurs par défaut et ne sont pas enrichies
    for (const index of [1, 2, 3]) {
      expect(computed[index].data.lien_lba).toBeUndefined()
      expect(computed[index].data.bounce_status).toBe("unknown")
    }

    const updated = await getDbCollection("mailingListsV2").findOne({ _id: mailingListId })
    expect(updated?.status).toBe("generate:success")
    expect(updated?.progress.generate).toBe(100)
  })

  it("should not call bouncer nor LBA when no line has a valid email", async () => {
    const mailingListId = new ObjectId()
    const jobId = new ObjectId()
    const mailingList = buildMailingList(mailingListId, jobId)

    await getDbCollection("mailingListsV2").insertOne(mailingList)
    await insertSourceLines(mailingListId, ["not-an-email", ""])

    await generateMailingList(mailingList, { _id: jobId } as IJobsSimple, new AbortController().signal)

    expect(verifyEmails).not.toHaveBeenCalled()
    expect(getTrainingLinks).not.toHaveBeenCalled()

    const computed = await getDbCollection("mailingList.computed").find({ mailing_list_id: mailingListId }).sort({ line_number: 1 }).toArray()
    expect(computed.map((line) => line.email_status)).toEqual(["invalid", "empty"])

    const updated = await getDbCollection("mailingListsV2").findOne({ _id: mailingListId })
    expect(updated?.status).toBe("generate:success")
  })
})
