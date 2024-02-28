import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const shouldShowRemunerationsAnnuelles = ({ values }: CerfaForm) => values.contrat.remunerationsAnnuelles;
