import { addMonths, differenceInMonths, isAfter, isBefore, parseISO, startOfDay, subMonths } from "date-fns";

import { caclAgeAtDate } from "../utils/form.utils";
import { CerfaControl } from ".";

export const ContratDatesControl: CerfaControl[] = [
  {
    deps: ["contrat.dateDebutContrat", "maitre1.dateNaissance"],
    process: ({ values }) => {
      const { dateDebutContrat } = values.contrat;
      const { dateNaissance } = values.maitre1;
      if (!dateDebutContrat || !dateNaissance) return;
      const { exactAge: ageMaitre } = caclAgeAtDate(dateNaissance, dateDebutContrat);

      if (ageMaitre < 18) {
        return {
          error: "Le maître d'apprentissage doit être majeur à la date de début d'exécution du contrat.",
        };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "maitre2.dateNaissance"],
    process: ({ values }) => {
      const { dateDebutContrat } = values.contrat;
      const { dateNaissance } = values.maitre2;
      if (!dateDebutContrat || !dateNaissance) return;
      const { exactAge: ageMaitre } = caclAgeAtDate(dateNaissance, dateDebutContrat);

      if (ageMaitre < 18) {
        return {
          error: "Le maître d'apprentissage doit être majeur à la date de début d'exécution du contrat.",
        };
      }
    },
  },
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
    deps: ["contrat.dateFinContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateFinContrat) return;
      const dateFinContrat = parseISO(values.contrat.dateFinContrat);
      if (isBefore(dateFinContrat, startOfDay(new Date()))) {
        return {
          error: "La date de conclusion du formulaire doit être antérieure ou égale à la date courante",
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

      if (isBefore(dateFinContrat, dateDebutContrat)) {
        return { error: "La date de début d'exécution du contrat doit être antérieure à la date de fin du contrat" };
      }

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
  {
    deps: ["contrat.dateSignature"],
    process: ({ values }) => {
      const { dateSignature, dateDebutContrat } = values.contrat;
      const { dateNaissance, responsableLegal } = values.apprenti;

      if (!dateSignature) return {};

      const dateSignatureDate = parseISO(dateSignature);

      if (dateNaissance) {
        const { exactAge: ageApprenti } = caclAgeAtDate(dateNaissance, dateSignature);

        if (ageApprenti < 18 && !responsableLegal.nom) {
          return {
            error:
              "Un responsable légal doit être renseigné si l'apprenti est mineur à la date de conclusion du contrat",
          };
        }
      }

      if (dateDebutContrat) {
        const dateDebutContratDate = parseISO(dateDebutContrat);

        if (isAfter(dateSignatureDate, dateDebutContratDate)) {
          return {
            error:
              "La date de conclusion d’un contrat initial doit être antérieure ou égale à sa date de début d’exécution",
          };
        }
      }

      return {};
    },
  },
  {
    deps: ["contrat.dateDebutFormationPratique"],
    process: ({ values }) => {
      const { dateDebutFormationPratique, dateDebutContrat, dateSignature, dateFinContrat } = values.contrat;

      if (!dateDebutFormationPratique) return {};
      const dateDebutFormationPratiqueDate = parseISO(dateDebutFormationPratique);

      if (dateDebutContrat) {
        const dateDebutContratDate = parseISO(dateDebutContrat);

        if (isBefore(dateDebutFormationPratiqueDate, dateDebutContratDate)) {
          return {
            error:
              "La date de début de formation pratique ne peut être antérieure à la date de début d'exécution du contrat",
          };
        }

        if (isAfter(dateDebutFormationPratiqueDate, addMonths(dateDebutContratDate, 3))) {
          return {
            error:
              "La date de début de formation pratique ne peut être postérieure à 3 mois après la date de début d'exécution du contrat",
          };
        }
      }

      if (dateSignature) {
        const dateSignatureDate = parseISO(dateSignature);

        if (isBefore(dateDebutFormationPratiqueDate, dateSignatureDate)) {
          return {
            error:
              "La date de début de formation pratique ne peut pas être antérieure à la date de conclusion du contrat",
          };
        }
      }

      if (dateFinContrat) {
        const dateFinContratDate = parseISO(dateFinContrat);

        if (isAfter(dateDebutFormationPratiqueDate, dateFinContratDate)) {
          return {
            error: "La date de début de formation pratique ne peut pas être postérieure à la date de fin du contrat",
          };
        }
      }
    },
  },
];
