import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const shouldAskAvantageNature = ({ values }: CerfaForm) => values.contrat.avantageNature === "oui";
