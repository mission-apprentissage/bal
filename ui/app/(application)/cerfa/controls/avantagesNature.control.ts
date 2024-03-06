import { shouldAskAvantageNature } from "shared/helpers/cerfa/domains/contrat/shouldAskAvantageNature";

import { CerfaControl } from ".";

export const avantagesNatureControl: CerfaControl[] = [
  {
    deps: ["contrat.avantageNature"],
    process: ({ values, cache }) => {
      const askAvantageNature = shouldAskAvantageNature({ values });
      if (askAvantageNature) {
        return {
          cascade: {
            "contrat.avantageNourriture": { value: cache?.avantageNourriture },
            "contrat.avantageLogement": { value: cache?.avantageLogement },
            "contrat.autreAvantageEnNature": { value: cache?.autreAvantageEnNature },
          },
        };
      } else {
        return {
          cache: values.contrat.avantageNourriture,
          cascade: {
            "contrat.avantageNourriture": { reset: true },
            "contrat.avantageLogement": { reset: true },
            "contrat.autreAvantageEnNature": { reset: true },
          },
        };
      }
    },
  },
];
