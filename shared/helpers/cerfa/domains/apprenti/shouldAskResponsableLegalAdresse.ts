import { CerfaForm } from "../../types/cerfa.types";
import { shouldAskRepresentantLegal } from "./shouldAskRepresentantLegal";

export const shouldAskResponsableLegalAdresse = ({ values }: CerfaForm) =>
  shouldAskRepresentantLegal({ values }) && values.apprenti.responsableLegal.memeAdresse === "non";
