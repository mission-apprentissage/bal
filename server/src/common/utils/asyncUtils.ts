export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index?: number, array?: T[]) => void
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index] as T, index, array);
  }
};

export function timeout<T>(promise: Promise<T>, millis: number): Promise<T> {
  let timeoutID: undefined | NodeJS.Timeout;
  const timeout: Promise<never> = new Promise((resolve, reject) => {
    timeoutID = setTimeout(
      () => reject(`Timed out after ${millis} ms.`),
      millis
    );
  });
  return Promise.race([promise, timeout]).finally(() =>
    clearTimeout(timeoutID)
  );
}

export async function sleep(
  durationMs: number,
  signal?: AbortSignal
): Promise<void> {
  await new Promise<void>((resolve) => {
    let timeout: NodeJS.Timeout | null = null;

    const listener = () => {
      if (timeout) clearTimeout(timeout);
      resolve();
    };

    timeout = setTimeout(() => {
      signal?.removeEventListener("abort", listener);
      resolve();
    }, durationMs);

    signal?.addEventListener("abort", listener);
  });
}
