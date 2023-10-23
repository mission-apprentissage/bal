import { CerfaControl } from ".";
import { fetchCodePostal } from "./utils/api.utils";

export const employeurCodePostalControl: CerfaControl[] = [
  {
    deps: ["employeur.adresse.codePostal"],
    process: async ({ values, dossier, signal }) => {
      const codePostal = values.employeur.adresse.codePostal;
      const { messages, result } = await fetchCodePostal({
        codePostal,
        dossierId: dossier._id,
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
