export const getDataFromSample = (sample: Array<Record<string, string> | undefined>, key: string): string[] => {
  return sample.map((row) => row?.[key] ?? "").filter((value) => value && value !== "");
};
