import { shouldAskRepresentantLegal } from "./shouldAskRepresentantLegal";

interface Form {
  values: any;
}

export const shouldAskResponsableLegalAdresse = ({ values }: Form) =>
  shouldAskRepresentantLegal({ values }) && values.apprenti.responsableLegal.memeAdresse === "non";
