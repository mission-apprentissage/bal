import { CerfaControl } from ".";
import { fetchNaf } from "./utils/api.utils";

export const employeurNafControl: CerfaControl[] = [
  {
    deps: ["employeur.naf"],
    process: async ({ values, signal }) => {
      const naf = values.employeur.naf;
      const formattedNaf = !naf.includes(".") && naf.length > 2 ? naf.substr(0, 2) + "." + naf.substr(2) : naf;

      const { error } = await fetchNaf({
        naf: formattedNaf,
        signal,
      });

      if (error) {
        return { error };
      }
    },
  },
];
