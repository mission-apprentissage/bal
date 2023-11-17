import { CerfaForm } from "../../../CerfaForm";

export const shouldAskDateEffetAvenant = ({ values }: CerfaForm) => {
  return ["31", "32", "33", "34", "35", "36", "37"].includes(values.contrat.typeContratApp);
};
