import { differenceInMonths, parseISO } from "date-fns";

import { CerfaControl } from ".";

export const dateFormationControl: CerfaControl[] = [
  {
    deps: ["formation.dateDebutFormation", "formation.dateFinFormation"],
    process: ({ values }) => {
      if (!values.formation.dateDebutFormation || !values.formation.dateFinFormation) return;
      const dateDebutFormation = parseISO(values.formation.dateDebutContrat);
      const dateFinFormation = parseISO(values.formation.dateDebutContrat);

      const dureeContrat = differenceInMonths(dateDebutFormation, dateFinFormation);

      if (dateDebutFormation >= dateFinFormation) {
        return {
          error: "Date de début du cycle de formation ne peut pas être après la date de fin du cycle",
        };
      }

      if (dureeContrat < 6) {
        return {
          error: "La durée de la formation de peut pas être inférieure à 6 mois",
        };
      }

      if (dureeContrat > 48) {
        return {
          error: "La durée de la formation de peut pas être supérieure à 4 ans",
        };
      }
    },
  },
  {
    deps: ["formation.dureeFormation"],
    process: ({ values }) => {
      const dureeFormation = values.formation.dureeFormation;

      if (dureeFormation > 9999) {
        return {
          error: "la durée de la formation ne peut excéder 9999",
        };
      }
    },
  },
];
