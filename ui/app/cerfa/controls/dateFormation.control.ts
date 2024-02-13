import { differenceInMonths, isAfter, isBefore, parseISO } from "date-fns";

import { CerfaControl } from ".";

export const dateFormationControl: CerfaControl[] = [
  {
    deps: ["formation.dateDebutFormation", "formation.dateFinFormation"],
    process: ({ values }) => {
      const {
        formation: { dateDebutFormation, dateFinFormation },
      } = values;
      if (!dateDebutFormation || !dateFinFormation) return;
      const dateDebutFormationDate = parseISO(dateDebutFormation);
      const dateFinFormationDate = parseISO(dateFinFormation);

      if (isAfter(dateDebutFormationDate, dateFinFormationDate)) {
        return {
          error: "La date de début de formation théorique ne peut pas être postérieure à la date de fin de formation",
        };
      }

      const dureeContrat = differenceInMonths(dateDebutFormationDate, dateFinFormationDate);

      if (dureeContrat < 6) {
        return {
          error: "La durée de formation ne peut pas être inférieure à 6 mois",
        };
      }

      if (dureeContrat > 48) {
        return {
          error: "La durée de formation ne peut pas être supérieure à 4 ans",
        };
      }
    },
  },
  {
    deps: ["formation.dateFinFormation"],
    process: ({ values }) => {
      const {
        contrat: { dateDebutContrat, dateFinContrat, dateSignature },
        formation: { dateFinFormation },
      } = values;
      if (!dateFinFormation) return {};
      const dateFinFormationDate = parseISO(dateFinFormation);

      if (dateDebutContrat) {
        const dateDebutContratDate = parseISO(dateDebutContrat);

        if (isBefore(dateFinFormationDate, dateDebutContratDate)) {
          return {
            error: "La date ne peut être antérieure à la date de début d'exécution du contrat",
          };
        }
      }

      if (dateFinContrat) {
        const dateFinContratDate = parseISO(dateFinContrat);

        if (isAfter(dateFinFormationDate, dateFinContratDate)) {
          return {
            error: "La date ne peut être postérieure à la date de fin de contrat",
          };
        }
      }

      if (dateSignature) {
        const dateSignatureDate = parseISO(dateSignature);

        if (isBefore(dateFinFormationDate, dateSignatureDate)) {
          return {
            error: "La date ne peut être antérieure à la date de conclusion du contrat",
          };
        }
      }
    },
  },
  {
    deps: ["formation.dureeFormation"],
    process: ({ values }) => {
      const {
        formation: { dureeFormation },
      } = values;

      if (dureeFormation > 9999) {
        return {
          error: "La durée de la formation ne peut excéder 9999",
        };
      }
    },
  },
];
