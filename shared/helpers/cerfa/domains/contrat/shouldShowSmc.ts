import { differenceInYears, parseISO } from "date-fns";
import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const shouldShowSmc = ({ values }: CerfaForm) => {
  if (!values.contrat.dateFinContrat || !values.apprenti.dateNaissance) return false;
  const dateFinContrat = parseISO(values.contrat.dateFinContrat);
  const dateNaissance = parseISO(values.apprenti.dateNaissance);

  return differenceInYears(dateFinContrat, dateNaissance) >= 21;
};
