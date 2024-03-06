import { CerfaControl } from ".";
import { fetchCodePostal } from "./utils/api.utils";

export const etablissementFormationCodePostalControl: CerfaControl[] = [
  {
    deps: ["etablissementFormation.adresse.codePostal"],
    process: async ({ values, signal }) => {
      const codePostal = values.etablissementFormation.adresse.codePostal;
      const { messages, result } = await fetchCodePostal({
        codePostal,
        signal,
      });

      if (messages.cp === "Ok") {
        return {
          cascade: {
            "etablissementFormation.adresse.commune": { value: result.commune.trim() },
          },
        };
      }

      return { error: messages.error };
    },
  },
];
