import { CerfaForm } from "../components/CerfaForm";
import { CerfaControl } from ".";
import { apiService } from "./utils/api.utils";

export const apprentiCodePostalControl: CerfaControl[] = [
  {
    deps: ["apprenti.adresse.codePostal"],
    process: async ({ values, signal }: CerfaForm) => {
      const codePostal = values.apprenti.adresse.codePostal;
      const { messages, result } = await apiService.fetchCodePostal({
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
