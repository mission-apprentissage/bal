import { CerfaControl } from ".";

export const numeroContratPrecedentControl: CerfaControl[] = [
  {
    deps: ["contrat.numeroContratPrecedent", "employeur.siret"],
    process: ({ values }) => {
      if (values.employeur.siret) return;
      return { error: "Veuillez saisir le siret de l'employeur dans la partie Employeur" };
    },
  },
];
