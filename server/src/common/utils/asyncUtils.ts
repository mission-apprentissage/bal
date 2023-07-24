export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index?: number, array?: T[]) => void
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
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

export async function sleep(durationMs: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, durationMs));
}
