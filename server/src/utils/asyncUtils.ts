export const asyncForEach = async <T>(
  array: T[],
  callback: (item: T, index?: number, array?: T[]) => void
) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function timeout(promise: Promise<any>, millis: number) {
  const timeout = new Promise((resolve, reject) => setTimeout(() => reject(`Timed out after ${millis} ms.`), millis));
  // @ts-ignore
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeout));
}
