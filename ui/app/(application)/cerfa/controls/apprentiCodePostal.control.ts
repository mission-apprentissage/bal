import { CerfaForm } from "shared/helpers/cerfa/types/cerfa.types";

import { CerfaControl } from ".";
import { fetchCodePostal } from "./utils/api.utils";

export const apprentiCodePostalControl: CerfaControl[] = [
  {
    deps: ["apprenti.adresse.codePostal"],
    process: async ({ values, signal }: CerfaForm) => {
      const codePostal = values.apprenti?.adresse?.codePostal;

      if (codePostal?.length < 5) return { error: "le code postal doit comporter 5 chiffres" };

      const { messages, result } = await fetchCodePostal({
        codePostal,
        signal,
      });

      if (messages?.cp === "Ok") {
        return {
          cascade: {
            "apprenti.adresse.commune": { value: result.commune.trim() },
          },
        };
      }

      return { error: messages?.error };
    },
  },
];
