import { CerfaControl } from ".";
import { fetchCodePostal } from "./utils/api.utils";

export const employeurCodePostalControl: CerfaControl[] = [
  {
    deps: ["employeur.adresse.codePostal"],
    process: async ({ values, signal }) => {
      const codePostal = values.employeur.adresse.codePostal;

      if (codePostal.length < 5) return { error: "le code postal doit comporter 5 chiffres" };

      const { messages, result } = await fetchCodePostal({
        codePostal,
        signal,
      });

      if (messages.cp === "Ok") {
        return {
          cascade: {
            "employeur.adresse.commune": { value: result.commune.trim() },
            "employeur.adresse.departement": { value: result.num_departement.trim() },
            "employeur.adresse.region": { value: result.num_region.trim() },
          },
        };
      }

      return { error: messages.error };
    },
  },
];
