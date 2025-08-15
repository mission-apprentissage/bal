import type { IDocumentContentJson } from "shared/models/documentContent.model";

export const getDataFromSample = (sample: IDocumentContentJson[], key: string) => {
  return (
    sample
      // @ts-ignore
      .map((row) => row?.content?.[key] ?? "")
      .filter((value) => value && value !== "")
  );
};
