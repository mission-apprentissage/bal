import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const isRequiredNumeroContratPrecedent = ({ values }: CerfaForm) =>
  [31, 32, 33, 34, 35, 36, 37].includes(values.contrat.typeContratApp);
