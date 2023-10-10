import { CerfaForm } from "../../../CerfaForm";

export const shouldShowRemunerationsAnnuelles = ({ values }: CerfaForm) => values.contrat.remunerationsAnnuelles;
