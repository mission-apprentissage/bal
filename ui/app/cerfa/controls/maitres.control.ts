import { isFuture, parseISO } from "date-fns";
import { caclAgeAtDate } from "shared/helpers/cerfa/utils/dates";

import { CerfaControl } from ".";

export const maitresControl: CerfaControl[] = [
  {
    deps: ["maitre1.dateNaissance"],
    process: ({ values }) => {
      if (!values.maitre1.dateNaissance || !values.contrat.dateDebutContrat) {
        return;
      }
      const maitreDateNaissance = parseISO(values.maitre1.dateNaissance);
      if (isFuture(maitreDateNaissance)) {
        return { error: "La date de naissance ne peut pas être dans le futur" };
      }
    },
  },
  {
    deps: ["maitre1.dateNaissance", "contrat.dateDebutContrat"],
    process: ({ values }) => {
      if (!values.maitre1.dateNaissance || !values.contrat.dateDebutContrat) {
        return;
      }
      const { age: ageDebutContrat } = caclAgeAtDate(values.maitre1.dateNaissance, values.contrat.dateDebutContrat);

      if (ageDebutContrat < 18) {
        return {
          error: "Le maître d'apprentissage doit avoir au moins 18 ans à la date de début d'exécution du contrat",
        };
      }
    },
  },
  {
    deps: ["maitre2.dateNaissance"],
    process: ({ values }) => {
      if (!values.maitre2.dateNaissance || !values.contrat.dateDebutContrat) {
        return;
      }
      const maitreDateNaissance = parseISO(values.maitre2.dateNaissance);
      if (isFuture(maitreDateNaissance)) {
        return { error: "La date de naissance ne peut pas être dans le futur" };
      }
    },
  },
  {
    deps: ["maitre2.dateNaissance", "contrat.dateDebutContrat"],
    process: ({ values }) => {
      if (!values.maitre2.dateNaissance || !values.contrat.dateDebutContrat) {
        return;
      }
      const { age: ageDebutContrat } = caclAgeAtDate(values.maitre2.dateNaissance, values.contrat.dateDebutContrat);
      if (ageDebutContrat < 18) {
        return {
          error: "Le maître d'apprentissage doit avoir au moins 18 ans à la date de début d'exécution du contrat",
        };
      }
    },
  },
];
