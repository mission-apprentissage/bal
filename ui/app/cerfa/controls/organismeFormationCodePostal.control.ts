import { CerfaControl } from ".";
import { fetchCodePostal } from "./utils/api.utils";

export const organismeFormationCodePostalControl: CerfaControl[] = [
  {
    deps: ["organismeFormation.adresse.codePostal"],
    process: async ({ values, dossier, signal }) => {
      const codePostal = values.organismeFormation.adresse.codePostal;
      const { messages, result } = await fetchCodePostal({
        codePostal,
        dossierId: dossier._id,
        signal,
      });

      if (messages.cp === "Ok") {
        return {
          cascade: {
            "organismeFormation.adresse.commune": { value: result.commune.trim() },
          },
        };
      }

      return { error: messages.error };
    },
  },
];
