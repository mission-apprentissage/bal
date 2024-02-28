import { caclAgeAtDate } from "shared/helpers/cerfa/utils/dates";

import { CerfaControl } from ".";

export const typeDerogationControl: CerfaControl[] = [
  {
    deps: ["apprenti.dateNaissance", "contrat.typeDerogation", "contrat.dateDebutContrat"],
    process: ({ values }) => {
      const { dateNaissance } = values.apprenti;
      const { typeDerogation, dateDebutContrat } = values.contrat;
      if (!dateNaissance || !typeDerogation || !dateDebutContrat) return;

      const { exactAge: ageAtDebutContrat } = caclAgeAtDate(dateNaissance, dateDebutContrat);

      if (ageAtDebutContrat > 16 && typeDerogation === "11") {
        return {
          error:
            "Le type de dérogation 11 est réservé aux apprentis de moins de 16 ans lors du début d’exécution du contrat",
        };
      }

      if (ageAtDebutContrat < 29 && typeDerogation === "12") {
        return {
          error:
            "Le type de dérogation 12 est réservé aux apprentis de plus de 29 ans lors du début d’exécution du contrat ",
        };
      }

      // const typeDerogationOptions = getTypeDerogationOptions({ values });
      // const isLockedValue = !!typeDerogationOptions.find((option) => option.value === typeDerogation)?.locked;

      // return {
      //   cascade: {
      //     "contrat.typeDerogation": { options: typeDerogationOptions, reset: isLockedValue },
      //   },
      // };
    },
  },
];
