import { CerfaForm } from "../../../CerfaForm";

export const getLabelNumeroContratPrecedent = ({ values }: CerfaForm) =>
  [21, 22, 23].includes(values.contrat.typeContratApp)
    ? "Numéro du contrat précédent"
    : "Numéro de contrat sur lequel porte l'avenant";