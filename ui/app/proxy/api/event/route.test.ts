import { afterEach, describe, expect, it, vi } from "vitest"

import { POST } from "./route"

const EVENT = JSON.stringify({ n: "pageview", u: "https://bal.apprentissage.beta.gouv.fr/", d: "bal.apprentissage.beta.gouv.fr", r: null })

function buildRequest(headers: Record<string, string>, body: string = EVENT): Request {
  return new Request("https://bal.apprentissage.beta.gouv.fr/proxy/api/event", { method: "POST", headers, body })
}

describe("POST /proxy/api/event", () => {
  const fetchMock = vi.spyOn(globalThis, "fetch")

  afterEach(() => {
    fetchMock.mockReset()
  })

  it("relaie l'événement à Plausible avec les en-têtes dont il a besoin", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 202, headers: { "content-type": "text/plain; charset=utf-8" } }))

    const response = await POST(buildRequest({ "content-type": "text/plain", "user-agent": "Firefox/157.0", "x-forwarded-for": "203.0.113.7" }))

    expect(response.status).toBe(202)
    expect(await response.text()).toBe("ok")
    expect(response.headers.get("content-type")).toBe("text/plain; charset=utf-8")

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("https://plausible.io/api/event")
    expect(init?.method).toBe("POST")
    expect(init?.body).toBe(EVENT)
    const headers = new Headers(init?.headers)
    expect(headers.get("content-type")).toBe("text/plain")
    expect(headers.get("user-agent")).toBe("Firefox/157.0")
    expect(headers.get("x-forwarded-for")).toBe("203.0.113.7")
  })

  it("ne transmet ni les cookies ni les en-têtes d'authentification", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 202 }))

    await POST(buildRequest({ "content-type": "text/plain", cookie: "bal_session=secret", authorization: "Bearer secret" }))

    const headers = new Headers(fetchMock.mock.calls[0][1]?.headers)
    expect([...headers.keys()]).toEqual(["content-type"])
  })

  it("refuse un corps au-delà de 64 Ko sans appeler Plausible", async () => {
    const response = await POST(buildRequest({ "content-type": "text/plain" }, "a".repeat(64 * 1024 + 1)))

    expect(response.status).toBe(413)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it("relaie un corps d'exactement 64 Ko", async () => {
    fetchMock.mockResolvedValue(new Response("ok", { status: 202 }))
    const body = "é".repeat(32 * 1024)

    const response = await POST(buildRequest({ "content-type": "text/plain" }, body))

    expect(response.status).toBe(202)
    expect(fetchMock.mock.calls[0][1]?.body).toBe(body)
  })

  it("renvoie le statut d'erreur de Plausible tel quel", async () => {
    fetchMock.mockResolvedValue(new Response("bad request", { status: 400 }))

    const response = await POST(buildRequest({ "content-type": "text/plain" }))

    expect(response.status).toBe(400)
  })

  it("répond 502 et journalise l'erreur quand Plausible est injoignable", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined)
    fetchMock.mockRejectedValue(new TypeError("fetch failed"))

    const response = await POST(buildRequest({ "content-type": "text/plain" }))

    expect(response.status).toBe(502)
    expect(consoleError).toHaveBeenCalledWith("Failed to proxy Plausible event", expect.any(TypeError))
    consoleError.mockRestore()
  })
})
