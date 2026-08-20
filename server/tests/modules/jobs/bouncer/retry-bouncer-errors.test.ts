import { useMongo } from "@tests/utils/mongo.utils"
import type { ProcessorStatus } from "job-processor"
import { getProcessorStatus } from "job-processor"
import { ObjectId } from "mongodb"
import type { BouncerEmail, BouncerPingResult } from "shared/models/bouncer.email.model"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"

import { verifyEmails } from "@/common/services/mailer/mailBouncer"
import { getDbCollection } from "@/common/utils/mongodbUtils"
import { retryBouncerErrorEmails } from "@/modules/jobs/bouncer/retry-bouncer-errors"

vi.mock("job-processor", async (importOriginal) => {
  const actual = await importOriginal<typeof import("job-processor")>()
  return { ...actual, getProcessorStatus: vi.fn() }
})

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

function buildPing(status: BouncerPingResult["status"]): BouncerPingResult {
  return { status, message: "test", responseCode: null, responseMessage: null }
}

function buildBouncerEmailDoc(email: string, status: BouncerPingResult["status"]): BouncerEmail {
  return {
    _id: new ObjectId(),
    email,
    domain: email.split("@")[1],
    smtp: "mx1.exemple.fr",
    ping: buildPing(status),
    created_at: now,
    ttl: status === "invalid" ? null : new Date("2026-08-21T00:00:00.000Z"),
  }
}

function mockProcessorStatus(status: { runningTaskName?: string; queuedJobNames?: string[] }): void {
  const { runningTaskName, queuedJobNames = [] } = status

  vi.mocked(getProcessorStatus).mockResolvedValue({
    now,
    workers: [
      {
        worker: { _id: new ObjectId(), hostname: "runner-test", lastSeen: now, tags: null },
        task: runningTaskName ? { _id: new ObjectId(), name: runningTaskName } : null,
      },
    ],
    queue: queuedJobNames.map((name) => ({ _id: new ObjectId(), name })),
  } as unknown as ProcessorStatus)
}

describe("retryBouncerErrorEmails", () => {
  it("should do nothing when another task is running", async () => {
    mockProcessorStatus({ runningTaskName: "mailing-list:process" })
    await getDbCollection("bouncer.email").insertOne(buildBouncerEmailDoc("a@exemple.fr", "error"))

    await retryBouncerErrorEmails(new AbortController().signal)

    expect(verifyEmails).not.toHaveBeenCalled()
    await expect(getDbCollection("bouncer.email").countDocuments({ "ping.status": "error" })).resolves.toBe(1)
  })

  it("should do nothing when a mailing-list job is queued", async () => {
    mockProcessorStatus({ queuedJobNames: ["mailing-list:process"] })
    await getDbCollection("bouncer.email").insertOne(buildBouncerEmailDoc("a@exemple.fr", "error"))

    await retryBouncerErrorEmails(new AbortController().signal)

    expect(verifyEmails).not.toHaveBeenCalled()
  })

  it("should re-verify only the emails in error and clear their cache entry", async () => {
    mockProcessorStatus({})
    await getDbCollection("bouncer.email").insertMany([
      buildBouncerEmailDoc("a@exemple.fr", "error"),
      buildBouncerEmailDoc("b@exemple.fr", "error"),
      buildBouncerEmailDoc("c@exemple.fr", "valid"),
    ])

    vi.mocked(verifyEmails).mockImplementation(async (emails) => emails.map((email) => ({ email, ping: buildPing("valid") })))

    await retryBouncerErrorEmails(new AbortController().signal)

    expect(verifyEmails).toHaveBeenCalledTimes(1)
    expect(vi.mocked(verifyEmails).mock.calls[0][0].toSorted()).toEqual(["a@exemple.fr", "b@exemple.fr"])

    // Les entrées en erreur ont été supprimées (re-vérification), l'entrée valide est intacte
    await expect(getDbCollection("bouncer.email").countDocuments({ "ping.status": "error" })).resolves.toBe(0)
    await expect(getDbCollection("bouncer.email").countDocuments({ email: "c@exemple.fr", "ping.status": "valid" })).resolves.toBe(1)
  })

  it("should not loop on an email that fails again during the run", async () => {
    mockProcessorStatus({})
    await getDbCollection("bouncer.email").insertOne(buildBouncerEmailDoc("greylisted@exemple.fr", "error"))

    // Simule le comportement réel : l'email retombe en erreur et est ré-inséré dans le cache
    vi.mocked(verifyEmails).mockImplementation(async (emails) => {
      await getDbCollection("bouncer.email").insertMany(emails.map((email) => buildBouncerEmailDoc(email, "error")))
      return emails.map((email) => ({ email, ping: buildPing("error") }))
    })

    await retryBouncerErrorEmails(new AbortController().signal)

    // Un seul passage malgré la ré-insertion en erreur : pas de boucle infinie
    expect(verifyEmails).toHaveBeenCalledTimes(1)
    await expect(getDbCollection("bouncer.email").countDocuments({ email: "greylisted@exemple.fr", "ping.status": "error" })).resolves.toBe(1)
  })
})
