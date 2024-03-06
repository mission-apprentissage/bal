import { isEmpty } from "lodash";
import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

import { CerfaControl } from ".";
import { nirControl } from "./common/nir.control";

export const maitresNirControl: CerfaControl[] = [
  {
    deps: ["maitre1.nir"],
    process: async ({ values }: CerfaForm) => {
      const { dateNaissance, nir: unsanitizedNir } = values.maitre1;
      if (!unsanitizedNir || isEmpty(unsanitizedNir)) {
        return {};
      }

      // remove _ (from mask) and spaces
      const nir = unsanitizedNir.replace(/_/g, "").replace(/ /g, "");

      return nirControl({
        nir,
        dateNaissance,
      });
    },
  },
  {
    deps: ["maitre2.nir"],
    process: async ({ values }: CerfaForm) => {
      const { nom, dateNaissance, nir: unsanitizedNir } = values.maitre2;
      if (!nom || isEmpty(nom) || !unsanitizedNir || isEmpty(unsanitizedNir)) {
        return {};
      }

      // remove _ (from mask) and spaces
      const nir = unsanitizedNir.replace(/_/g, "").replace(/ /g, "");

      return nirControl({
        nir,
        dateNaissance,
      });
    },
  },
];
