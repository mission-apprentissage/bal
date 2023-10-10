import { getTypeDerogationOptions } from "../components/blocks/contrat/domain/getTypeDerogationOptions";
import { CerfaControl } from ".";

export const typeDerogationControl: CerfaControl[] = [
  {
    deps: ["apprenti.age"],
    process: ({ values }) => {
      const age = values.apprenti.age;
      if (!age) return;

      const typeDerogation = values.contrat.typeDerogation;
      const typeDerogationOptions = getTypeDerogationOptions({ values });
      const isLockedValue = !!typeDerogationOptions.find((option) => option.value === typeDerogation)?.locked;

      return {
        cascade: {
          "contrat.typeDerogation": { options: typeDerogationOptions, reset: isLockedValue },
        },
      };
    },
  },
];
