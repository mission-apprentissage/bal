import { isEmpty } from "lodash";

import { CerfaForm } from "../components/CerfaForm";
import { CerfaControl } from ".";

export const apprentiNirControl: CerfaControl[] = [
  {
    deps: ["apprenti.nir"],
    process: async ({ values }: CerfaForm) => {
      const dateNaissance = values.apprenti.dateNaissance;
      const sexe = values.apprenti.sexe;
      const nir = values.apprenti.nir as string;

      if (isEmpty(nir)) {
        return {};
      }

      if (!isEmpty(sexe)) {
        if (sexe === "M" && !nir.startsWith("1")) {
          return {
            error:
              "Le sexe renseigné ne correspond pas au 1er chiffre du NIR (il doit commencer par 1 pour le sexe Masculin)",
          };
        }

        if (sexe === "F" && !nir.startsWith("2")) {
          return {
            error:
              "Le sexe renseigné ne correspond pas au 1er chiffre du NIR (il doit commencer par 2 pour le sexe Féminin)",
          };
        }
      }

      if (nir?.length < 3) {
        return {};
      }

      if (!isEmpty(dateNaissance) && nir?.substring(1, 3) !== dateNaissance.substring(2, 4)) {
        return {
          error: "L'année de naissance indiquée ne correspond pas aux 2e et 3e chiffres du NIR",
        };
      }

      if (nir?.length < 5) {
        return {};
      }

      if (!isEmpty(dateNaissance) && nir?.substring(3, 5) !== dateNaissance.substring(5, 7)) {
        return {
          error: "Le mois de naissance indiqué ne correspond pas aux 4e et 5e chiffres du NIR",
        };
      }

      if (!nir.startsWith("2") && !nir.startsWith("1")) {
        return {
          error: "Le NIR doit commencer par 1 ou 2",
        };
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
