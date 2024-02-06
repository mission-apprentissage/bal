import { isEmpty } from "lodash";

import { ControlReturn } from "..";

interface NirControlParams {
  nir: string;
  sexe?: string;
  dateNaissance?: string;
  departementNaissance?: string;
}

/**
 * Nir controls, pass non-null and sanitized nir
 */
export const nirControl: (params: NirControlParams) => ControlReturn = ({
  nir,
  sexe,
  dateNaissance,
  departementNaissance,
}) => {
  if (!nir || isEmpty(nir)) {
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

  if (nir.length < 3) {
    return {};
  }

  if (dateNaissance && !isEmpty(dateNaissance)) {
    if (nir.substring(1, 3) !== dateNaissance.substring(2, 4)) {
      return {
        error: "L'année de naissance indiquée ne correspond pas aux 2e et 3e chiffres du NIR",
      };
    }
  }

  if (nir.length < 5) {
    return {};
  }

  if (dateNaissance && !isEmpty(dateNaissance)) {
    if (nir.substring(3, 5) !== dateNaissance.substring(5, 7)) {
      return {
        error: "Le mois de naissance indiqué ne correspond pas aux 4e et 5e chiffres du NIR",
      };
    }
  }

  if (!nir.startsWith("2") && !nir.startsWith("1")) {
    return {
      error: "Le NIR doit commencer par 1 ou 2",
    };
  }

  if (nir.length < 7) {
    return {};
  }

  if (departementNaissance && !isEmpty(departementNaissance) && nir.substring(5, 7) !== departementNaissance) {
    return {
      error: "Le département renseigné ne correspond pas aux 6e et 7e chiffre du NIR",
    };
  }

  return undefined;
};
