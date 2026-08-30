import { EventEmitter } from "node:events"

import { captureException } from "@sentry/node"
import { useMongo } from "@tests/utils/mongo.utils"
import { ObjectId } from "mongodb"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { verifyEmails } from "@/common/services/mailer/mailBouncer"
import { getDbCollection } from "@/common/utils/mongodbUtils"

const resolveMxMock = vi.hoisted(() => vi.fn())
const createConnectionMock = vi.hoisted(() => vi.fn())

vi.mock("dns", async (importOriginal) => {
  const actual = await importOriginal<typeof import("dns")>()
  return { ...actual, resolveMx: resolveMxMock }
})

vi.mock("net", async (importOriginal) => {
  const actual = await importOriginal<typeof import("net")>()
  return { ...actual, createConnection: createConnectionMock }
})

vi.mock("@sentry/node", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@sentry/node")>()
  return { ...actual, captureException: vi.fn() }
})

const SMTP_HOST = "mx.exemple.fr"
const ONE_HOUR_MS = 60 * 60 * 1000

class FakeSocket extends EventEmitter {
  destroyed = false
  writeError: Error | null = null
  setEncoding = vi.fn()
  setTimeout = vi.fn()

  write(_data: Buffer, callback: () => void) {
    if (this.writeError) {
      throw this.writeError
    }
    callback()
    return true
  }

  destroy() {
    this.destroyed = true
  }
}

const mongo = useMongo()

// mailBouncer garde deux caches au niveau module : la Map des domaines (5 min) et la
// résolution MX (1 h). Aucun n'est réinitialisable de l'extérieur : chaque test avance
// l'horloge d'assez pour les périmer, sinon il hériterait de l'état du précédent.
let clock = new Date("2026-08-30T10:00:00.000Z")

beforeAll(async () => {
  await mongo.beforeAll()
})

beforeEach(async () => {
  await mongo.beforeEach()

  clock = new Date(clock.getTime() + 2 * ONE_HOUR_MS)
  vi.useFakeTimers({ toFake: ["Date"], now: clock })

  resolveMxMock.mockImplementation((_domain: string, callback: (err: Error | null, addresses?: { exchange: string; priority: number }[]) => void) =>
    callback(null, [{ exchange: SMTP_HOST, priority: 10 }])
  )
})

afterEach(() => {
  vi.useRealTimers()
})

afterAll(async () => {
  await mongo.afterAll()
})

/**
 * Marque le serveur MX comme « détection supportée » (ping null) pour que verifyEmail
 * court-circuite verifyDomain et atteigne le cache par email.
 */
async function seedKnownDomain() {
  await getDbCollection("bouncer.domain").insertOne({
    _id: new ObjectId(),
    domain: "seed.exemple.fr",
    smtp: SMTP_HOST,
    ping: null,
    created_at: new Date(),
    updated_at: new Date(),
  })
}

function mockUnreachableSmtp() {
  createConnectionMock.mockImplementation(() => {
    const socket = new FakeSocket()
    setTimeout(() => {
      socket.destroyed = true
      socket.emit("error", Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:25"), { code: "ECONNREFUSED" }))
    }, 0)
    return socket
  })
}

const ERROR_PING = { status: "error", message: "SMTP connection failed", responseCode: null, responseMessage: null }

describe("verifyEmails", () => {
  it("should cache an unreachable MX instead of letting the error escape", async () => {
    await seedKnownDomain()
    mockUnreachableSmtp()

    const results = await verifyEmails(["injoignable@exemple.fr"], new AbortController().signal)

    expect(results).toEqual([{ email: "injoignable@exemple.fr", ping: ERROR_PING }])

    // Sans mise en cache, chaque génération de liste re-sonderait le même domaine mort
    const cached = await getDbCollection("bouncer.email").findOne({ email: "injoignable@exemple.fr" })
    expect(cached?.ping).toEqual(ERROR_PING)
    expect(cached?.smtp).toBe(SMTP_HOST)
    expect(cached?.ttl).toBeInstanceOf(Date)

    // Une erreur réseau contre un MX tiers n'est pas un défaut applicatif
    expect(captureException).not.toHaveBeenCalled()
  })

  it("should cache a domain-level failure so the retry cron can pick it up", async () => {
    // Pas d'amorçage : le MX est inconnu, c'est verifyDomain qui sonde puis court-circuite
    mockUnreachableSmtp()

    const results = await verifyEmails(["alpha@exemple.fr", "beta@exemple.fr", "gamma@exemple.fr"], new AbortController().signal)

    expect(results.map((r) => r.ping.status)).toEqual(["error", "error", "error"])
    // Le court-circuit par domaine reste en place : un seul sondage pour les trois adresses
    expect(createConnectionMock).toHaveBeenCalledTimes(1)

    // retryBouncerErrorEmails et refreshBouncerStatuses ne lisent que bouncer.email : sans
    // ces entrées, les lignes resteraient bloquées en erreur à chaque réexport de la liste
    const cached = await getDbCollection("bouncer.email").find({}).sort({ email: 1 }).toArray()
    expect(cached.map((doc) => doc.email)).toEqual(["alpha@exemple.fr", "beta@exemple.fr", "gamma@exemple.fr"])
    expect(cached.every((doc) => doc.ping.status === "error")).toBe(true)
    expect(cached.every((doc) => doc.ttl instanceof Date)).toBe(true)
  })

  it("should stop condemning a MX once the error cache entry has expired", async () => {
    mockUnreachableSmtp()

    await verifyEmails(["premier@exemple.fr"], new AbortController().signal)
    expect(createConnectionMock).toHaveBeenCalledTimes(1)

    // Dans la foulée, le MX condamné n'est pas re-sondé
    await verifyEmails(["second@exemple.fr"], new AbortController().signal)
    expect(createConnectionMock).toHaveBeenCalledTimes(1)

    // Passé le TTL d'erreur, un blip réseau ne masque plus le rétablissement du serveur
    vi.setSystemTime(new Date(clock.getTime() + 61_000))

    await verifyEmails(["troisieme@exemple.fr"], new AbortController().signal)
    expect(createConnectionMock).toHaveBeenCalledTimes(2)
  })

  it("should still report an unexpected error to Sentry", async () => {
    await seedKnownDomain()

    // La bannière passe, puis l'écriture échoue pour une raison étrangère au transport SMTP
    createConnectionMock.mockImplementation(() => {
      const socket = new FakeSocket()
      setTimeout(() => {
        socket.emit("data", "220 mx.exemple.fr ready\r\n")
        socket.writeError = new Error("boom inattendu")
      }, 0)
      return socket
    })

    const results = await verifyEmails(["inattendu@exemple.fr"], new AbortController().signal)

    expect(results[0].ping).toEqual({ status: "error", message: "Unknown error occurred", responseCode: null, responseMessage: null })
    expect(captureException).toHaveBeenCalledTimes(1)
    expect(vi.mocked(captureException).mock.calls[0][0]).toMatchObject({ message: "boom inattendu" })
  })
})
