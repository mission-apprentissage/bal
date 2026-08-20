import { AxiosError } from "axios"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { TrainingLinkData } from "./lba"
import { getTrainingLinks } from "./lba"

const postMock = vi.hoisted(() => vi.fn())

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>()
  return {
    ...actual,
    default: {
      ...actual.default,
      create: () => ({ post: postMock }),
    },
  }
})

function buildData(count: number): TrainingLinkData[] {
  return Array.from(
    { length: count },
    (_, i): TrainingLinkData => ({
      id: `${i + 1}`,
      cle_ministere_educatif: "",
      mef: "",
      cfd: "",
      rncp: "",
      code_postal: "",
      code_insee: "",
      uai_lieu_formation: "",
      uai_formateur: "",
      uai_formateur_responsable: "",
    })
  )
}

function buildAxiosError(status: number | null): AxiosError {
  const response = status === null ? undefined : ({ status } as AxiosError["response"])
  return new AxiosError("request failed", status === null ? "ECONNABORTED" : undefined, undefined, undefined, response)
}

describe("getTrainingLinks", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("should split data in chunks of 100 and preserve order", async () => {
    postMock.mockImplementation(async (_url: string, chunk: TrainingLinkData[]) => ({
      data: chunk.map((item) => ({ id: item.id, lien_lba: `lba-${item.id}`, lien_prdv: `prdv-${item.id}` })),
    }))

    const result = await getTrainingLinks(buildData(250))

    expect(postMock).toHaveBeenCalledTimes(3)
    expect(postMock.mock.calls.map(([, chunk]) => chunk.length)).toEqual([100, 100, 50])
    expect(result).toHaveLength(250)
    expect(result[0]).toEqual({ id: "1", lien_lba: "lba-1", lien_prdv: "prdv-1" })
    expect(result[249]).toEqual({ id: "250", lien_lba: "lba-250", lien_prdv: "prdv-250" })
  })

  it("should retry a chunk on server error and succeed", async () => {
    postMock.mockRejectedValueOnce(buildAxiosError(502)).mockImplementation(async (_url: string, chunk: TrainingLinkData[]) => ({
      data: chunk.map((item) => ({ id: item.id, lien_lba: "", lien_prdv: "" })),
    }))

    const promise = getTrainingLinks(buildData(10))
    await vi.runAllTimersAsync()
    const result = await promise

    expect(postMock).toHaveBeenCalledTimes(2)
    expect(result).toHaveLength(10)
  })

  it("should retry on network error without response", async () => {
    postMock.mockRejectedValueOnce(buildAxiosError(null)).mockImplementation(async (_url: string, chunk: TrainingLinkData[]) => ({
      data: chunk.map((item) => ({ id: item.id, lien_lba: "", lien_prdv: "" })),
    }))

    const promise = getTrainingLinks(buildData(1))
    await vi.runAllTimersAsync()
    const result = await promise

    expect(postMock).toHaveBeenCalledTimes(2)
    expect(result).toHaveLength(1)
  })

  it("should not retry on 4xx errors", async () => {
    postMock.mockRejectedValue(buildAxiosError(400))

    await expect(getTrainingLinks(buildData(1))).rejects.toThrow("Erreur lors de la génération des liens de prises de rendez-vous")
    expect(postMock).toHaveBeenCalledTimes(1)
  })

  it("should fail after exhausting retries", async () => {
    postMock.mockRejectedValue(buildAxiosError(503))

    const promise = getTrainingLinks(buildData(1))
    const assertion = expect(promise).rejects.toThrow("Erreur lors de la génération des liens de prises de rendez-vous")
    await vi.runAllTimersAsync()
    await assertion

    // 1 tentative initiale + 2 retries
    expect(postMock).toHaveBeenCalledTimes(3)
  })
})
