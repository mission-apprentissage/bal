import * as Yup from "yup";

import { CerfaControl } from ".";

export const courrielControl: CerfaControl[] = [
  {
    deps: ["employeur.courriel"],
    process: async ({ values }) => {
      const employeur = values.employeur.courriel;
      try {
        await Yup.string().email().validate(employeur);
      } catch (error) {
        return { error: "Le courriel doit être valide." };
      }
      return {};
    },
  },
  {
    deps: ["apprenti.responsableLegal.courriel"],
    process: async ({ values }) => {
      const responsableLegal = values.apprenti.responsableLegal.courriel;
      try {
        await Yup.string().email().validate(responsableLegal);
      } catch (error) {
        return { error: "Le courriel doit être valide." };
      }
      return {};
    },
  },
  {
    deps: ["apprenti.courriel"],
    process: async ({ values }) => {
      const apprenti = values.apprenti.courriel;

      try {
        await Yup.string().email().validate(apprenti);
      } catch (error) {
        return { error: "Le courriel doit être valide." };
      }

      return {};
    },
  },
  {
    deps: ["maitre1.courriel"],
    process: async ({ values }) => {
      const maitre1 = values.maitre1.courriel;

      try {
        await Yup.string().email().validate(maitre1);
      } catch (error) {
        return { error: "Le courriel doit être valide." };
      }

      return {};
    },
  },
  {
    deps: ["maitre2.courriel"],
    process: async ({ values }) => {
      const maitre2 = values.maitre2.courriel;

      try {
        await Yup.string().email().validate(maitre2);
      } catch (error) {
        return { error: "Le courriel doit être valide." };
      }

      return {};
    },
  },
];
