import { isEmpty } from "lodash";
import { CerfaForm, InformationMessage } from "shared/helpers/cerfa/types/cerfa.types";

import { CerfaControl } from ".";

export const apprentiNationaliteControl: CerfaControl[] = [
  {
    deps: ["apprenti.nationalite"],
    process: async ({ values }: CerfaForm) => {
      const {
        apprenti: { nationalite },
      } = values;

      if (isEmpty(nationalite)) {
        return {};
      }

      let informationMessages: InformationMessage[] = [];

      if (nationalite === "3") {
        informationMessages = [
          {
            type: "regulatory",
            content: `Les demandes de titres et d'autorisation de travail pour un salarié étranger, non citoyen européen, peuvent être réalisées sur le [site Etrangers en France](https://administration-etrangers-en-france.interieur.gouv.fr/particuliers/#/).
            Il n'est pas nécessaire de joindre cette autorisation avec le cerfa.`,
          },
        ];
      }

      return {
        cascade: {
          "apprenti.nationalite": {
            informationMessages,
            cascade: false,
          },
        },
      };
    },
  },
];
