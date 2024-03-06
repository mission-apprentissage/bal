import { isEmpty } from "lodash";
import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

import { CerfaControl } from ".";
import { nirControl } from "./common/nir.control";

export const apprentiNirControl: CerfaControl[] = [
  {
    deps: ["apprenti.nir"],
    process: async ({ values }: CerfaForm) => {
      const { dateNaissance, departementNaissance, sexe, nir: unsanitizedNir } = values.apprenti;
      if (!unsanitizedNir || isEmpty(unsanitizedNir)) {
        return {};
      }

      // remove _ (from mask) and spaces
      const nir = unsanitizedNir.replace(/_/g, "").replace(/ /g, "");

      const controlledNir = nirControl({
        nir,
        sexe,
        dateNaissance,
        departementNaissance,
      });

      if (controlledNir !== undefined) {
        return controlledNir;
      }

      const anneeNir = parseInt(nir?.substring(1, 3));
      const moisNir = nir?.substring(3, 5);
      const annee = anneeNir < 15 ? `20${anneeNir}` : `19${anneeNir}`;

      return {
        cascade: {
          ...(isEmpty(sexe) ? { "apprenti.sexe": { value: nir.startsWith("1") ? "M" : "F", cascade: false } } : {}),
          ...(isEmpty(dateNaissance)
            ? {
                "apprenti.dateNaissance": {
                  value: `${annee}-${moisNir}-01`,
                  cascade: false,
                },
              }
            : {}),
        },
      };
    },
  },
];
