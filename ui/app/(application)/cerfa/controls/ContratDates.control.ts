import { addMonths, differenceInMonths, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import { InformationMessage } from "shared/helpers/cerfa/types/cerfa.types";
import { caclAgeAtDate } from "shared/helpers/cerfa/utils/dates";

import { CerfaControl } from ".";

export const ContratDatesControl: CerfaControl[] = [
  {
    deps: ["contrat.dateDebutContrat"],
    process: ({ values }) => {
      const {
        contrat: { dateDebutContrat },
        apprenti: { dateNaissance, projetCreationRepriseEntreprise, inscriptionSportifDeHautNiveau, handicap },
      } = values;

      if (!dateDebutContrat || !dateNaissance) return {};

      const { exactAge: ageApprenti } = caclAgeAtDate(dateNaissance, dateDebutContrat);

      if ([projetCreationRepriseEntreprise, inscriptionSportifDeHautNiveau, handicap].includes("oui")) {
        return {};
      }

      if (ageApprenti > 30) {
        return {
          error:
            "Votre apprenti(e) a plus de 30 ans à la date de début d’exécution du contrat, veuillez vérifier qu’il ou elle se situe bien dans un des cas d’exception prévus par la loi",
        };
      } else {
        if (ageApprenti >= 15) {
          return {
            cascade: {
              "contrat.dateDebutContrat": {
                success: true,
                stateRelatedMessage: `L'apprenti a ${ageApprenti} ans à la date de début d'exécution du contrat.`,
              },
            },
          };
        }
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "maitre1.dateNaissance"],
    process: ({ values }) => {
      const {
        contrat: { dateDebutContrat },
        maitre1: { dateNaissance },
      } = values;

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
      const {
        contrat: { dateDebutContrat },
        maitre2: { dateNaissance },
      } = values;
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
      const {
        contrat: { dateDebutContrat, dateEffetAvenant },
      } = values;
      if (!dateDebutContrat || !dateEffetAvenant) return;
      const dateDebutContratDate = parseISO(dateDebutContrat);
      const dateEffetAvenantDate = parseISO(dateEffetAvenant);
      if (isAfter(dateDebutContratDate, dateEffetAvenantDate)) {
        return {
          error: "La date de début de contrat ne peut pas être après la date d'effet de l'avenant",
        };
      }
    },
  },
  {
    deps: ["contrat.dateFinContrat"],
    process: ({ values }) => {
      const {
        apprenti: { dateNaissance, nationalite },
        contrat: { dateDebutContrat, dateFinContrat },
      } = values;
      if (!dateFinContrat) return;
      const dateFinContratDate = parseISO(dateFinContrat);

      if (isBefore(dateFinContratDate, startOfDay(new Date()))) {
        return {
          error: "La date de conclusion du formulaire doit être antérieure ou égale à la date courante",
        };
      }

      // control apprenti ASE
      if (!dateNaissance || !dateDebutContrat || !nationalite) return;

      const { exactAge: ageApprentiDebutContrat } = caclAgeAtDate(dateNaissance, dateDebutContrat);
      const { exactAge: ageApprentiFinContrat } = caclAgeAtDate(dateNaissance, dateFinContrat);

      let informationMessages: InformationMessage[] = [];

      if (nationalite === "3" && ageApprentiDebutContrat < 18 && ageApprentiFinContrat >= 18) {
        informationMessages = [
          {
            type: "regulatory",
            content: `Votre apprenti(e) est né(e) hors Union européenne : s’il ou elle est suivi(e) par l'ASE, il ou elle dispose d'un droit au séjour, à la formation et l'emploi jusqu'à  sa majorité. Comme il ou elle aura 18 ans en cours de contrat, il faudra donc penser au renouvellement de son titre.`,
          },
        ];
      }

      return {
        cascade: {
          "contrat.dateFinContrat": {
            informationMessages,
            cascade: false,
          },
        },
      };
    },
  },
  {
    deps: ["contrat.dateFinContrat", "contrat.dateEffetAvenant"],
    process: ({ values }) => {
      const {
        contrat: { dateFinContrat, dateEffetAvenant },
      } = values;
      if (!dateFinContrat || !dateEffetAvenant) return;
      const dateFinContratDate = parseISO(dateFinContrat);
      const dateEffetAvenantDate = parseISO(dateEffetAvenant);
      if (isBefore(dateFinContratDate, dateEffetAvenantDate)) {
        return {
          error: "La date de fin de contrat ne peut pas être avant la date d'effet de l'avenant",
        };
      }
    },
  },
  {
    deps: ["contrat.dateSignature", "formation.dateDebutFormation"],
    process: ({ values }) => {
      const {
        contrat: { dateSignature },
        formation: { dateDebutFormation },
      } = values;

      if (!dateSignature || !dateDebutFormation) return;
      const dateSignatureDate = parseISO(values.contrat.dateSignature);
      const dateDebutFormationDate = parseISO(values.formation.dateDebutFormation);

      if (isBefore(dateDebutFormationDate, dateSignatureDate)) {
        return {
          error:
            "La date de début de formation théorique ne peut pas être antérieure à la date de conclusion du contrat",
        };
      }
    },
  },
  {
    deps: ["contrat.dateFinContrat", "formation.dateFinFormation"],
    process: ({ values }) => {
      const {
        contrat: { dateFinContrat },
        formation: { dateFinFormation },
      } = values;

      if (!dateFinContrat || !dateFinFormation) return;
      const dateFinContratDate = parseISO(dateFinContrat);
      const dateFinFormationDate = parseISO(dateFinFormation);
      const dateFinFormation3MonthsAfter = addMonths(dateFinFormationDate, 3);

      if (isAfter(dateFinContratDate, dateFinFormation3MonthsAfter)) {
        return {
          error: "Le contrat peut se terminer au maximum 3 mois après la fin de la formation",
        };
      }
    },
  },
  {
    deps: ["contrat.dateDebutContrat", "contrat.dateFinContrat"],
    process: ({ values }) => {
      const {
        contrat: { dateDebutContrat, dateFinContrat },
      } = values;

      if (!dateDebutContrat || !dateFinContrat) return;

      const dateDebutContratDate = parseISO(dateDebutContrat);
      const dateFinContratDate = parseISO(dateFinContrat);

      const dureeContrat = differenceInMonths(dateFinContratDate, dateDebutContratDate);

      if (isBefore(dateFinContrat, dateDebutContrat)) {
        return { error: "La date de début d'exécution du contrat doit être antérieure à la date de fin du contrat" };
      }

      if (dureeContrat < 0) {
        return {
          error: "La date de début de contrat ne peut pas être après la date de fin de contrat",
        };
      }

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
    deps: ["contrat.dateSignature"],
    process: ({ values }) => {
      const {
        apprenti: { dateNaissance, apprentiMineurNonEmancipe, responsableLegal },
        contrat: { dateSignature, dateDebutContrat },
      } = values;

      if (!dateSignature) return {};

      const dateSignatureDate = parseISO(dateSignature);

      if (dateNaissance) {
        const { exactAge: ageApprenti } = caclAgeAtDate(dateNaissance, dateSignature);

        if (ageApprenti < 18 && !responsableLegal.nom && apprentiMineurNonEmancipe !== "non") {
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
      const {
        contrat: { dateDebutFormationPratique, dateDebutContrat, dateSignature, dateFinContrat },
      } = values;

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
