export const asyncForEach = async <T>(array: T[], callback: (item: T, index?: number, array?: T[]) => void) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index] as T, index, array)
  }
}

export async function timeout<T>(promise: Promise<T>, millis: number): Promise<T> {
  let timeoutID: undefined | NodeJS.Timeout
  const timeout: Promise<never> = new Promise((_resolve, reject) => {
    timeoutID = setTimeout(() => reject(`Timed out after ${millis} ms.`), millis)
  })
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutID))
}

export async function mapWithConcurrency<T, R>(items: T[], concurrency: number, callback: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length)
  let nextIndex = 0

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++
      results[index] = await callback(items[index])
    }
  })

  await Promise.all(workers)

  return results
}

export async function sleep(durationMs: number, signal: AbortSignal | null = null): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    let timeout: NodeJS.Timeout | null = null

    const listener = () => {
      if (timeout) clearTimeout(timeout)
      if (signal) {
        signal?.removeEventListener("abort", listener)
        if (signal.aborted) {
          reject(signal.reason)
          return
        }
      }
      resolve()
    }

    timeout = setTimeout(() => {
      signal?.removeEventListener("abort", listener)
      resolve()
    }, durationMs)

    signal?.addEventListener("abort", listener)
  })
}
