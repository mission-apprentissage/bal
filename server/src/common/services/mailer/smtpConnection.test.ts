import { EventEmitter } from "node:events"

import { beforeEach, describe, expect, it, vi } from "vitest"
import { createSmtpConnection, getSmtpServer, isExpectedSmtpError } from "./smtpConnection"

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

type MxRecord = { exchange: string; priority: number }
type ResolveMxCallback = (err: Error | null, addresses?: MxRecord[]) => void

function mockResolutionFailureOnce() {
  resolveMxMock.mockImplementationOnce((_domain: string, callback: ResolveMxCallback) => callback(new Error("queryMx ETIMEOUT")))
}

function mockResolutionSuccessOnce(exchange: string) {
  resolveMxMock.mockImplementationOnce((_domain: string, callback: ResolveMxCallback) => callback(null, [{ exchange, priority: 10 }]))
}

describe("getSmtpServer", () => {
  beforeEach(() => {
    // Purge toute implémentation "once" non consommée (ex. appel évité par le cache)
    resolveMxMock.mockReset()
  })

  it("should not cache a failed resolution", async () => {
    // Un timeout DNS ne doit pas être mémorisé : la résolution suivante doit être retentée,
    // sinon tout le domaine serait marqué invalide (cache permanent côté bouncer)
    mockResolutionFailureOnce()
    await expect(getSmtpServer("user@dns-flaky.exemple.fr")).resolves.toBeNull()

    mockResolutionSuccessOnce("mx1.exemple.fr")
    await expect(getSmtpServer("user@dns-flaky.exemple.fr")).resolves.toBe("mx1.exemple.fr")

    expect(resolveMxMock).toHaveBeenCalledTimes(2)
  })

  it("should cache a successful resolution", async () => {
    mockResolutionSuccessOnce("mx1.exemple.fr")
    await expect(getSmtpServer("user@dns-ok.exemple.fr")).resolves.toBe("mx1.exemple.fr")

    // La valeur cachée est servie sans nouvelle résolution DNS
    resolveMxMock.mockClear()
    await expect(getSmtpServer("autre@dns-ok.exemple.fr")).resolves.toBe("mx1.exemple.fr")

    expect(resolveMxMock).not.toHaveBeenCalled()
  })

  it("should pick the MX record with the lowest priority", async () => {
    resolveMxMock.mockImplementationOnce((_domain: string, callback: ResolveMxCallback) =>
      callback(null, [
        { exchange: "backup.exemple.fr", priority: 20 },
        { exchange: "primary.exemple.fr", priority: 5 },
      ])
    )

    await expect(getSmtpServer("user@dns-priorites.exemple.fr")).resolves.toBe("primary.exemple.fr")
  })

  it("should return null when the domain has no MX record", async () => {
    resolveMxMock.mockImplementationOnce((_domain: string, callback: ResolveMxCallback) => callback(null, []))

    await expect(getSmtpServer("user@dns-sans-mx.exemple.fr")).resolves.toBeNull()
  })

  it("should return null when the email has no domain", async () => {
    await expect(getSmtpServer("pas-un-email")).resolves.toBeNull()
    expect(resolveMxMock).not.toHaveBeenCalled()
  })
})

describe("isExpectedSmtpError", () => {
  it.each(["connection error", "connection timeout", "Connection closed"])("should treat %s as an expected transport error", (message) => {
    expect(isExpectedSmtpError(new Error(message))).toBe(true)
  })

  it.each([
    // Near-miss : un message proche ne doit pas être silencié
    new Error("connection errored"),
    new Error("Connection closed by peer"),
    new Error("connection error: ECONNREFUSED"),
    // Une vraie erreur applicative doit rester remontée
    new Error("Unknown command: FOO"),
    new TypeError("terminated"),
  ])("should not treat %s as an expected transport error", (err) => {
    expect(isExpectedSmtpError(err)).toBe(false)
  })

  it("should not treat a non-Error value as an expected transport error", () => {
    expect(isExpectedSmtpError("connection error")).toBe(false)
    expect(isExpectedSmtpError(null)).toBe(false)
  })
})

describe("createSmtpConnection", () => {
  const tick = () => new Promise((resolve) => setTimeout(resolve, 0))

  class FakeSocket extends EventEmitter {
    destroyed = false
    written: string[] = []
    setEncoding = vi.fn()
    setTimeout = vi.fn()

    write(data: Buffer, callback: () => void) {
      this.written.push(data.toString("utf-8"))
      callback()
      return true
    }

    destroy() {
      this.destroyed = true
    }
  }

  function connect(socket: FakeSocket) {
    createConnectionMock.mockReturnValueOnce(socket)

    return createSmtpConnection(
      { port: 25, fqdn: "bal.test", sender: "expediteur@exemple.fr", email: "destinataire@exemple.fr", smtp: "mx.exemple.fr" },
      new AbortController().signal
    )
  }

  it("should surface the original transport error instead of the QUIT failure", async () => {
    const socket = new FakeSocket()
    const connection = connect(socket)

    const banner = connection.next("CONNECT")
    await tick()
    socket.emit("data", "220 mx.exemple.fr ready\r\n")
    await expect(banner).resolves.toMatchObject({ value: { code: "220" } })

    const ehlo = connection.next("EHLO")
    await tick()

    // Le serveur coupe la connexion : le QUIT de courtoisie ne peut plus être écrit
    socket.destroyed = true
    socket.emit("error", Object.assign(new Error("connect ECONNREFUSED 127.0.0.1:25"), { code: "ECONNREFUSED" }))

    // Sans propagation de l'erreur d'origine, l'échec du QUIT ("Connection closed") la masquerait
    await expect(ehlo).rejects.toThrow("connection error")
    await expect(ehlo).rejects.toMatchObject({ cause: { code: "ECONNREFUSED" } })
  })

  it("should terminate each command with a single CRLF", async () => {
    const socket = new FakeSocket()
    const connection = connect(socket)

    const banner = connection.next("CONNECT")
    await tick()
    socket.emit("data", "220 mx.exemple.fr ready\r\n")
    await banner

    const ehlo = connection.next("EHLO")
    await tick()
    socket.emit("data", "250 mx.exemple.fr\r\n")
    await ehlo

    const quit = connection.next("QUIT")
    await tick()
    socket.emit("data", "221 bye\r\n")
    await quit

    // write() ajoute le CRLF : une commande passée avec son propre "\r\n" enverrait une ligne vide
    expect(socket.written).toEqual(["EHLO bal.test\r\n", "QUIT\r\n"])
  })

  it("should surface a connection timeout", async () => {
    const socket = new FakeSocket()
    const connection = connect(socket)

    const banner = connection.next("CONNECT")
    await tick()

    // Déclenche le handler passé à socket.setTimeout()
    socket.setTimeout.mock.calls[0][1]()

    await expect(banner).rejects.toThrow("connection timeout")
  })
})
