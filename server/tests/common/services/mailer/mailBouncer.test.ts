import { EventEmitter } from "node:events"
import { captureException } from "@sentry/node"
import { useMongo } from "@tests/utils/mongo.utils"
import { ObjectId } from "mongodb"
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
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

beforeAll(async () => {
  await mongo.beforeAll()
})

beforeEach(async () => {
  await mongo.beforeEach()
  resolveMxMock.mockImplementation((_domain: string, callback: (err: Error | null, addresses?: { exchange: string; priority: number }[]) => void) =>
    callback(null, [{ exchange: SMTP_HOST, priority: 10 }])
  )
})

afterAll(async () => {
  await mongo.afterAll()
})

/**
 * Marque le serveur MX comme "détection supportée" (ping null) pour que verifyEmail
 * court-circuite verifyDomain et atteigne réellement la mise en cache par email.
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

function mockSocket(configure: (socket: FakeSocket) => void) {
  createConnectionMock.mockImplementation(() => {
    const socket = new FakeSocket()
    setTimeout(() => configure(socket), 0)
    return socket
  })
}

describe("verifyEmails", () => {
  it("should cache an unreachable MX instead of letting the error escape", async () => {
    await seedKnownDomain()

    // Le serveur refuse la connexion : c'est le symptôme observé en production
    mockSocket((socket) => {
      socket.destroyed = true
      socket.emit("error", Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:25"), { code: "ECONNREFUSED" }))
    })

    const results = await verifyEmails(["injoignable@exemple.fr"], new AbortController().signal)

    expect(results).toEqual([{ email: "injoignable@exemple.fr", ping: { status: "error", message: "SMTP connection failed", responseCode: null, responseMessage: null } }])

    // Sans mise en cache, chaque génération de liste re-sonderait le même domaine mort
    const cached = await getDbCollection("bouncer.email").findOne({ email: "injoignable@exemple.fr" })
    expect(cached?.ping).toEqual({ status: "error", message: "SMTP connection failed", responseCode: null, responseMessage: null })
    expect(cached?.smtp).toBe(SMTP_HOST)
    expect(cached?.ttl).toBeInstanceOf(Date)

    // Une erreur réseau contre un MX tiers n'est pas un défaut applicatif
    expect(captureException).not.toHaveBeenCalled()
  })

  it("should still report an unexpected error to Sentry", async () => {
    await seedKnownDomain()

    // La bannière passe, puis l'écriture échoue pour une raison qui n'est pas du transport SMTP
    mockSocket((socket) => {
      socket.emit("data", "220 mx.exemple.fr ready\r\n")
      socket.writeError = new Error("boom inattendu")
    })

    const results = await verifyEmails(["inattendu@exemple.fr"], new AbortController().signal)

    expect(results[0].ping).toEqual({ status: "error", message: "Unknown error occurred", responseCode: null, responseMessage: null })
    expect(captureException).toHaveBeenCalledTimes(1)
    expect(vi.mocked(captureException).mock.calls[0][0]).toMatchObject({ message: "boom inattendu" })
  })
})
