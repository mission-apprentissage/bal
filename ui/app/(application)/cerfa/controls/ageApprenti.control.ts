import { isFuture, parseISO } from "date-fns";
import { caclAgeAtDate } from "shared/helpers/cerfa/utils/dates";

import { CerfaControl } from ".";

export const ageApprentiControl: CerfaControl[] = [
  {
    deps: ["apprenti.dateNaissance"],
    process: ({ values }) => {
      const dateNaissance = parseISO(values.apprenti.dateNaissance);

      if (isFuture(dateNaissance)) {
        return { error: "La date de naissance ne peut pas être dans le futur" };
      }
    },
  },
  {
    deps: ["apprenti.dateNaissance", "contrat.dateDebutContrat"],
    process: ({ values }) => {
      if (!values.contrat.dateDebutContrat) return;
      const { exactAge: ageDebutContrat } = caclAgeAtDate(
        values.apprenti.dateNaissance,
        values.contrat.dateDebutContrat
      );

      if (ageDebutContrat < 15) {
        return { error: "L'apprenti(e) doit avoir au moins 15 ans à la date de début d'exécution du contrat" };
      }
      return {
        cascade: {
          "apprenti.age": { value: ageDebutContrat },
        },
      };
    },
  },
];
