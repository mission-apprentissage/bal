export const getDataFromSample = (sample: Array<Record<string, unknown> | undefined>, key: string): string[] => {
  return sample.map((row) => String(row?.[key] ?? "")).filter((value) => value && value !== "");
};
