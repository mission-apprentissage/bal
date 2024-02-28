import { CerfaForm } from "../../types/cerfa.types";

export const shouldAskEtablissementFormation = ({ values }: CerfaForm) =>
  values.etablissementFormation?.memeResponsable === "non";
