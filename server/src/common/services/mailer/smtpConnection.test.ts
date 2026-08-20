import { beforeEach, describe, expect, it, vi } from "vitest"
import { getSmtpServer } from "./smtpConnection"

const resolveMxMock = vi.hoisted(() => vi.fn())

vi.mock("dns", async (importOriginal) => {
  const actual = await importOriginal<typeof import("dns")>()
  return { ...actual, resolveMx: resolveMxMock }
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
