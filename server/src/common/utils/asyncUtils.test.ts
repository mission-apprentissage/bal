import { describe, expect, it } from "vitest"
import { mapWithConcurrency, sleep } from "./asyncUtils"

describe("mapWithConcurrency", () => {
  it("should return results in input order", async () => {
    const items = [50, 10, 30, 5, 20]

    const results = await mapWithConcurrency(items, 3, async (ms) => {
      await sleep(ms)
      return ms * 2
    })

    expect(results).toEqual([100, 20, 60, 10, 40])
  })

  it("should never exceed the concurrency limit", async () => {
    let running = 0
    let maxRunning = 0

    await mapWithConcurrency(
      Array.from({ length: 20 }, (_, i) => i),
      4,
      async () => {
        running++
        maxRunning = Math.max(maxRunning, running)
        await sleep(5)
        running--
      }
    )

    expect(maxRunning).toBeLessThanOrEqual(4)
    expect(maxRunning).toBeGreaterThan(1)
  })

  it("should process all items when concurrency is greater than item count", async () => {
    const results = await mapWithConcurrency([1, 2], 10, async (i) => i + 1)

    expect(results).toEqual([2, 3])
  })

  it("should return an empty array for an empty input", async () => {
    const callback = async () => {
      throw new Error("should not be called")
    }

    await expect(mapWithConcurrency([], 5, callback)).resolves.toEqual([])
  })

  it("should reject when concurrency is not a positive integer", async () => {
    const callback = async (i: number) => i

    await expect(mapWithConcurrency([1], 0, callback)).rejects.toThrow("concurrency doit être un entier positif")
    await expect(mapWithConcurrency([1], -2, callback)).rejects.toThrow("concurrency doit être un entier positif")
    await expect(mapWithConcurrency([1], 1.5, callback)).rejects.toThrow("concurrency doit être un entier positif")
  })

  it("should propagate callback errors", async () => {
    await expect(
      mapWithConcurrency([1, 2, 3], 2, async (i) => {
        if (i === 2) {
          throw new Error("boom")
        }
        return i
      })
    ).rejects.toThrow("boom")
  })
})
