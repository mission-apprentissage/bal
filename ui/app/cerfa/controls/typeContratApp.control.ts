import { getLabelNumeroContratPrecedent } from "../components/blocks/contrat/domain/getLabelNumeroContratPrecedent";
import { isRequiredNumeroContratPrecedent } from "../components/blocks/contrat/domain/isRequiredNumeroContratPrecedent";
import { shouldAskNumeroContratPrecedent } from "../components/blocks/contrat/domain/shouldAskContratPrecedent";
import { shouldAskDateEffetAvenant } from "../components/blocks/contrat/domain/shouldAskDateEffetAvenant";
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
