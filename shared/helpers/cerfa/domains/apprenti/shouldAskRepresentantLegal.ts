import { CerfaForm } from "../../types/cerfa.types";

export const shouldAskRepresentantLegal = ({ values }: CerfaForm) => {
  return values.apprenti.apprentiMineurNonEmancipe === "oui";
};
