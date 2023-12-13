import { CerfaControl } from ".";
import { fetchCfdrncp } from "./utils/api.utils";

export const rncpControl: CerfaControl[] = [
  {
    deps: ["formation.rncp"],
    process: async ({ values, signal }) => {
      const rncp = values.formation.rncp;

      const { messages, result, error } = await fetchCfdrncp({
        rncp,
        signal,
      });

      if (error) {
        return { error };
      }

      if (messages?.code_rncp !== "Ok") {
        return { error: messages.code_rncp };
      }

      if (result.active_inactive === "INACTIVE") {
        return { error: `Le code ${rncp} est inactif.` };
      }

      if (!result.cfds) {
        return {
          cascade: {
            "formation.codeDiplome": { reset: true, cascade: false },
            "formation.intituleQualification": { value: result.intitule_diplome },
          },
        };
      }

      if (result.cfds.length > 1) {
        // TODO: handle many cfds
        const selectedCFD = result.cfds[0]; // TODO métier
        return {
          cascade: {
            "formation.codeDiplome": { value: selectedCFD, cascade: false },
            "formation.intituleQualification": { value: result.intitule_diplome },
          },
        };
      }

      return {
        cascade: {
          "formation.codeDiplome": { value: result.cfds[0], cascade: false },
          "formation.intituleQualification": { value: result.intitule_diplome },
        },
      };
    },
  },
];
