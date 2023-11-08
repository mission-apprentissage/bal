import { CerfaForm } from "../../../CerfaForm";

export const shouldAskEtablissementFormation = ({ values }: CerfaForm) =>
  values.etablissementFormation?.memeResponsable === false;
