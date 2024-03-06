import { idcc, isIdccEnVigueur } from "shared/constants/idcc";

import { CerfaControl } from ".";

export const idccControl: CerfaControl[] = [
  {
    deps: ["employeur.codeIdcc"],
    process: ({ values, fields: _ }) => {
      const codeIdcc = values.employeur.codeIdcc;
      const foundIdcc = idcc?.[codeIdcc?.padStart(4, "0")];

      if (!foundIdcc) {
        return {
          error: "Le code IDCC est inconnu",
        };
      }
      const idccEnVigueur = isIdccEnVigueur(foundIdcc);

      return {
        ...(!idccEnVigueur && {
          error: "Cette convention collective n’est plus applicable (abrogée, dénoncée, périmée ou remplacée)",
        }),
        cascade: {
          "employeur.codeIdcc_special": { value: codeIdcc, cascade: false },
          "employeur.libelleIdcc": { value: foundIdcc.libelle?.trim() },
        },
      };
    },
  },
  {
    deps: ["employeur.codeIdcc_special"],
    process: ({ values, fields: _ }) => {
      const codeIdcc = values.employeur.codeIdcc_special;
      const foundIdcc = idcc?.[codeIdcc];

      if (!foundIdcc) return;

      return {
        cascade: {
          "employeur.codeIdcc": { value: codeIdcc, cascade: false },
          "employeur.libelleIdcc": { value: foundIdcc.libelle?.trim() },
        },
      };
    },
  },
];
