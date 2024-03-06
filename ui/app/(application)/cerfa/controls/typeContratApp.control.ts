import { getLabelNumeroContratPrecedent } from "shared/helpers/cerfa/domains/contrat/getLabelNumeroContratPrecedent";
import { isRequiredNumeroContratPrecedent } from "shared/helpers/cerfa/domains/contrat/isRequiredNumeroContratPrecedent";
import { shouldAskNumeroContratPrecedent } from "shared/helpers/cerfa/domains/contrat/shouldAskContratPrecedent";
import { shouldAskDateEffetAvenant } from "shared/helpers/cerfa/domains/contrat/shouldAskDateEffetAvenant";

import { CerfaControl } from ".";

export const typeContratAppControl: CerfaControl[] = [
  {
    deps: ["contrat.typeContratApp"],
    process: ({ values }) => {
      return {
        cascade: {
          "contrat.numeroContratPrecedent": shouldAskNumeroContratPrecedent({ values })
            ? {
                label: getLabelNumeroContratPrecedent({ values }),
                required: isRequiredNumeroContratPrecedent({ values }),
              }
            : { reset: true, required: false },
          "contrat.dateEffetAvenant": shouldAskDateEffetAvenant({ values })
            ? { required: true }
            : { required: false, reset: true },
        },
      };
    },
  },
];
