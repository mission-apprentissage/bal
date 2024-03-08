import { CerfaControl } from ".";
import { fetchCodePostal } from "./utils/api.utils";

export const responsableLegalCodePostalControl: CerfaControl = {
  deps: ["apprenti.responsableLegal.adresse.codePostal"],
  process: async ({ values, signal }) => {
    const codePostal = values.apprenti.responsableLegal.adresse.codePostal;

    if (codePostal?.length < 5) return { error: "Le code postal doit comporter 5 chiffres" };

    const { messages, result } = await fetchCodePostal({
      codePostal,
      signal,
    });

    if (messages.cp === "Ok") {
      return {
        cascade: { "apprenti.responsableLegal.adresse.commune": { value: result.commune.trim() } },
      };
    }
    return { error: messages.error };
  },
};
