import { CerfaForm } from "../../../CerfaForm";

export const shouldAskAvantageNature = ({ values }: CerfaForm) => values.contrat.avantageNature === "oui";
