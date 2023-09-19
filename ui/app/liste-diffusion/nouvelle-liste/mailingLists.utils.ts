import { IDocumentContentJson } from "shared/models/documentContent.model";

export const getDataFromSample = (sample: IDocumentContentJson[], key: string) => {
  return (
    sample
      // @ts-ignore
      .map((row) => row?.content?.[key] ?? "")
      .filter((value) => value && value !== "")
  );
};

export const getFormattedSample = (sample: IDocumentContentJson[], key: string, size = 3) => {
  const data = getDataFromSample(sample, key);

  if (data.length === 0) {
    return "Aucune donnée disponible";
  }

  return data.slice(0, size).join(", ");
};
