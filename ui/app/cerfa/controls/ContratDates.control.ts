import { addMonths, differenceInMonths, isAfter, isBefore, parseISO, subMonths } from "date-fns";

import { CerfaControl } from ".";

export const ContratDatesControl: CerfaControl[] = [
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateEffetAvenant"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateEffetAvenant) return;
      const dateDebutContrat = parseISO(values.contrat.dateDebutContrat);
      const dateEffetAvenant = parseISO(values.contrat.dateEffetAvenant);
      if (isAfter(dateDebutContrat, dateEffetAvenant)) {
        return {
          error: "La date de début de contrat ne peut pas être après la date d'effet de l'avenant",
        };
      }
    },
  },
  {
    deps: ["contrat.dateFinContrat", "contrat.dateEffetAvenant"],
    process: ({ values }) => {
      if (!values.contrat.dateFinContrat || !values.contrat.dateEffetAvenant) return;
      const dateFinContrat = parseISO(values.contrat.dateFinContrat);
      const dateEffetAvenant = parseISO(values.contrat.dateEffetAvenant);
      if (isBefore(dateFinContrat, dateEffetAvenant)) {
        return {
          error: "La date de fin de contrat ne peut pas être avant la date d'effet de l'avenant",
        };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "formation.dateDebutFormation"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.formation.dateDebutFormation) return;
      const dateDebutContrat = parseISO(values.contrat.dateDebutContrat);
      const dateDebutFormation = parseISO(values.formation.dateDebutFormation);
      const dateDebutFormation3MonthsBefore = subMonths(dateDebutFormation, 3);

      if (isBefore(dateDebutContrat, dateDebutFormation3MonthsBefore)) {
        return {
          error: "Le contrat peut commencer au maximum 3 mois avant le début de la formation",
        };
      }
    },
  },
  {
    deps: ["contrat.dateFinContrat", "formation.dateFinFormation"],
    process: ({ values }) => {
      if (!values.contrat.dateFinContrat || !values.formation.dateFinFormation) return;
      const dateFinContrat = parseISO(values.contrat.dateFinContrat);
      const dateFinFormation = parseISO(values.formation.dateFinFormation);
      const dateFinFormation3MonthsAfter = addMonths(dateFinFormation, 3);

      if (isAfter(dateFinContrat, dateFinFormation3MonthsAfter)) {
        return {
          error: "Le contrat peut se terminer au maximum 3 mois après la fin de la formation",
        };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateFinContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateFinContrat) return;
      const dateDebutContrat = parseISO(values.contrat.dateDebutContrat);
      const dateFinContrat = parseISO(values.contrat.dateFinContrat);

      const dureeContrat = differenceInMonths(dateFinContrat, dateDebutContrat);
      if (dureeContrat < 0) {
        return {
          error: "La date de début de contrat ne peut pas être après la date de fin de contrat",
        };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateFinContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateFinContrat) return;
      const dateDebutContrat = parseISO(values.contrat.dateDebutContrat);
      const dateFinContrat = parseISO(values.contrat.dateFinContrat);

      const dureeContrat = differenceInMonths(dateFinContrat, dateDebutContrat);
      if (dureeContrat < 6) {
        return { error: "La durée du contrat ne peut pas être inférieure à 6 mois" };
      }

      if (dureeContrat > 54) {
        return {
          error: "La durée du contrat ne peut pas être supérieure à 4 ans et 6 mois",
        };
      }

      return {
        cascade: {
          "contrat.dureeContrat": { value: dureeContrat },
        },
      };
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateFinContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat || !values.contrat.dateFinContrat) return;
      const dateDebutContrat = parseISO(values.contrat.dateDebutContrat);
      const dateFinContrat = parseISO(values.contrat.dateFinContrat);

      const dureeContrat = differenceInMonths(dateFinContrat, dateDebutContrat);
      if (dureeContrat > 54) {
        return {
          error: "La durée du contrat ne peut pas être supérieure à 4 ans et 6 mois",
        };
      }
    },
  },
];
