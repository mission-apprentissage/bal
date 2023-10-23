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

      if (messages?.rncp?.code_rncp !== "Ok") {
        return { error: messages?.code_rncp };
      }

      return {
        cascade: {
          "formation.rncp": { value: result.rncp.code_rncp, cascade: false },
          "formation.intituleQualification": { value: result.rncp.intitule_diplome },
        },
      };
    },
  },
];
