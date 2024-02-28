import { CerfaForm } from "../../types/cerfa.types";

export const getLabelNumeroContratPrecedent = ({ values }: CerfaForm) =>
  [21, 22, 23].includes(values.contrat.typeContratApp)
    ? "Numéro du contrat précédent"
    : "Numéro du contrat précédent ou du contrat sur lequel porte l'avenant";
