import { idcc } from "shared/constants/idcc";

import { CerfaControl } from ".";

export const idccControl: CerfaControl[] = [
  {
    deps: ["employeur.codeIdcc"],
    process: ({ values, fields: _ }) => {
      const codeIdcc = values.employeur.codeIdcc;
      const foundIdcc = idcc?.[codeIdcc];

      if (codeIdcc.length < 4) {
        return { error: "Le code IDCC doit comporter 4 chiffres" };
      }

      if (!foundIdcc) {
        return { error: "Le code IDCC est inconnu" };
      }

      return {
        cascade: {
          "employeur.codeIdcc_special": { value: codeIdcc, cascade: false },
          "employeur.libelleIdcc": { value: foundIdcc.libelle.trim() },
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
