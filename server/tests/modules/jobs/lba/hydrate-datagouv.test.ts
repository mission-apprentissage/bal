import { useMongo } from "@tests/utils/mongo.utils"
import { Collection, MongoServerError } from "mongodb"
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest"
import { sleep } from "@/common/utils/asyncUtils"
import { getDbCollection } from "@/common/utils/mongodbUtils"
import { hydrateDataGouv } from "@/modules/jobs/lba/hydrate-datagouv"

vi.mock("@/common/utils/asyncUtils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/common/utils/asyncUtils")>()
  return { ...actual, sleep: vi.fn() }
})

const mongo = useMongo()

beforeAll(async () => {
  await mongo.beforeAll()
})

beforeEach(async () => {
  await mongo.beforeEach()
  vi.mocked(sleep).mockReset()
})

afterAll(async () => {
  await mongo.afterAll()
})

const HEADER = "siret,domain_email,data_source\n"
const ROWS = ["11111111100011,un.exemple.fr,moncomptepro\n", "22222222200022,deux.exemple.fr,trackdechets_postal_mail\n", "33333333300033,trois.exemple.fr,moncomptepro\n"]
const FULL_CSV = HEADER + ROWS.join("")

// Le flux livre `partial`, attend que ses lignes soient en base, puis échoue comme une coupure HTTP/2 en plein téléchargement.
function brokenStreamResponse(partial: string, savedBeforeError: number, error: Error): Response {
  const encoder = new TextEncoder()
  let delivered = false
  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (delivered) {
        await vi.waitFor(async () => expect(await getDbCollection("organisations").countDocuments()).toBe(savedBeforeError))
        controller.error(error)
        return
      }
      delivered = true
      controller.enqueue(encoder.encode(partial))
    },
  })
  return new Response(body)
}

describe("hydrateDataGouv", () => {
  const fetchMock = vi.spyOn(globalThis, "fetch")

  afterEach(() => {
    fetchMock.mockReset()
  })

  it("rejoue l'import quand le flux est coupé en cours de lecture, sans créer de doublon", async () => {
    fetchMock.mockResolvedValueOnce(brokenStreamResponse(HEADER + ROWS[0] + ROWS[1], 1, new TypeError("terminated"))).mockResolvedValueOnce(new Response(FULL_CSV))
    let savedAtRetry = -1
    vi.mocked(sleep).mockImplementation(async () => {
      savedAtRetry = await getDbCollection("organisations").countDocuments()
    })

    await hydrateDataGouv()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(vi.mocked(sleep).mock.calls.map(([ms]) => ms)).toEqual([30_000])
    expect(savedAtRetry).toBe(1)
    const organisations = await getDbCollection("organisations")
      .find({}, { sort: { siren: 1 } })
      .toArray()
    expect(organisations.map((o) => o.email_domain)).toEqual(["un.exemple.fr", "deux.exemple.fr", "trois.exemple.fr"])
  })

  it("rejoue sur une erreur serveur", async () => {
    fetchMock.mockResolvedValueOnce(new Response("", { status: 503 })).mockResolvedValueOnce(new Response(FULL_CSV))

    await hydrateDataGouv()

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(await getDbCollection("organisations").countDocuments()).toBe(3)
  })

  it("abandonne après trois tentatives et remonte la dernière erreur", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"))

    await expect(hydrateDataGouv()).rejects.toThrow("fetch failed")

    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(vi.mocked(sleep).mock.calls.map(([ms]) => ms)).toEqual([30_000, 120_000])
  })

  it("ne rejoue pas une erreur client", async () => {
    fetchMock.mockResolvedValue(new Response("", { status: 404, statusText: "Not Found" }))

    await expect(hydrateDataGouv()).rejects.toThrow("Failed to fetch data: 404 Not Found")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })

  it("ne rejoue pas un TypeError qui ne vient pas du réseau", async () => {
    fetchMock.mockRejectedValue(new TypeError("Cannot read properties of undefined (reading 'body')"))

    await expect(hydrateDataGouv()).rejects.toThrow("Cannot read properties of undefined")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })

  it("ne rejoue pas un CSV mal formé", async () => {
    fetchMock.mockResolvedValue(new Response(`${HEADER}11111111100011,"un"exemple.fr,moncomptepro\n`))

    await expect(hydrateDataGouv()).rejects.toThrow(/quote/i)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })

  it("échoue sans rejouer quand l'écriture en base échoue", async () => {
    fetchMock.mockResolvedValue(new Response(FULL_CSV))
    const updateOneSpy = vi.spyOn(Collection.prototype, "updateOne").mockRejectedValueOnce(new MongoServerError({ message: "write failed" }))

    try {
      await expect(hydrateDataGouv()).rejects.toThrow("write failed")
    } finally {
      updateOneSpy.mockRestore()
    }

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })

  it("ne rejoue pas quand le job est annulé", async () => {
    const controller = new AbortController()
    fetchMock.mockImplementation(async () => {
      controller.abort()
      throw new TypeError("fetch failed")
    })

    await expect(hydrateDataGouv(controller.signal)).rejects.toThrow("fetch failed")

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })
})
