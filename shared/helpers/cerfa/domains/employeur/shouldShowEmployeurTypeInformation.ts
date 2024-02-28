import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

export const shouldShowEmployeurTypeInformation = ({ values }: CerfaForm) => {
  return values.employeur.privePublic === "public";
};
