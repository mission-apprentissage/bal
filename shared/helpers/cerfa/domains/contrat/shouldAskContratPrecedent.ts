import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const shouldAskNumeroContratPrecedent = ({ values }: CerfaForm) => {
  const typeContratApp = values.contrat.typeContratApp;
  return ["21", "22", "23", "31", "32", "33", "34", "35", "36", "37", "38"].includes(typeContratApp);
};
