import { CerfaControl } from ".";

export const dureeTravailControl: CerfaControl[] = [
  {
    deps: ["contrat.dureeTravailHebdoHeures", "contrat.dureeTravailHebdoMinutes"],
    process: ({ values }) => {
      const minutes = parseInt(values.contrat.dureeTravailHebdoMinutes);
      const heures = parseInt(values.contrat.dureeTravailHebdoHeures);

      if (minutes > 0 && heures >= 40) {
        return { error: "la durée de travail hebdomadaire en heures ne peut excéder 40h" };
      }
      if (heures > 40) {
        return { error: "la durée de travail hebdomadaire en heures ne peut excéder 40h" };
      }
    },
  },
];
