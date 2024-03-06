import { CerfaControl } from ".";
import { fetchCfdrncp } from "./utils/api.utils";

export const codeDiplomeControl: CerfaControl[] = [
  {
    deps: ["formation.codeDiplome"],
    process: async ({ values, signal }) => {
      const cfd = values.formation.codeDiplome;
      const { messages, result, error } = await fetchCfdrncp({
        cfd,
        signal,
      });

      if (error) {
        return { error };
      }
      if (messages?.rncps[0].messages !== "Ok") {
        return { error: messages?.code_rncp };
      }

      const selectedRNCP = result.rncps[0]; // TODO métier

      return {
        cascade: {
          "formation.rncp": { value: selectedRNCP.code_rncp, cascade: false },
          "formation.intituleQualification": { value: selectedRNCP.intitule_diplome },
        },
      };
    },
  },
];
