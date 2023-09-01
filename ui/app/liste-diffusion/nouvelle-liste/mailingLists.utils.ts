import { IDocumentContentJson } from "shared/models/documentContent.model";

export const getDataFromSample = (
  sample: IDocumentContentJson[],
  key: string
) => {
  const data = sample
    // @ts-ignore
    .map((row) => row?.content?.[key] ?? "")
    .filter((value) => value && value !== "");

  if (data.length === 0) {
    return "Aucune donnée disponible";
  }

  return data.slice(0, 3).join(", ");
};
