import { addMonths, isAfter, isBefore, parseISO, subMonths } from "date-fns";

import { CerfaControl } from ".";

export const formationDatesControl: CerfaControl[] = [
  {
    deps: ["formation.dateDebutFormation"],
    process: ({ values }) => {
      const { dateDebutFormation } = values.formation;
      const { dateDebutFormationPratique, dateDebutContrat } = values.contrat;

      if (!dateDebutFormation) return {};
      const dateDebutFormationDate = parseISO(dateDebutFormation);

      if (dateDebutFormationPratique) {
        const dateDebutFormationPratiqueDate = new Date(dateDebutFormationPratique);

        if (isBefore(dateDebutFormationDate, subMonths(dateDebutFormationPratiqueDate, 3)))
          return {
            error:
              "La date de début de formation théorique ne peut être antérieure à 3 mois avant la date de début de formation pratique",
          };
      }

      if (dateDebutContrat) {
        const dateDebutContratDate = parseISO(dateDebutContrat);

        if (
          isBefore(dateDebutFormationDate, subMonths(dateDebutContratDate, 3)) ||
          isAfter(dateDebutFormationDate, addMonths(dateDebutContratDate, 3))
        )
          return {
            error:
              "La date de début de formation théorique ne peut être postérieure à 3 mois après la date de début d'exécution du contrat et ne peut être antérieure à 3 mois avant la date de début d'exécution du contrat",
          };
      }
    },
  },
];
