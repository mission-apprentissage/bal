import { CerfaControl } from ".";
import { emailControl } from "./common/email.control";

export const courrielControl: CerfaControl[] = [
  {
    deps: ["employeur.courriel"],
    process: async ({ values }) => {
      const {
        employeur: { courriel },
      } = values;

      return emailControl(courriel);
    },
  },
  {
    deps: ["apprenti.responsableLegal.courriel"],
    process: async ({ values }) => {
      const {
        apprenti: {
          responsableLegal: { courriel },
        },
      } = values;

      return emailControl(courriel);
    },
  },
  {
    deps: ["apprenti.courriel"],
    process: async ({ values }) => {
      const {
        apprenti: { courriel },
      } = values;

      return emailControl(courriel);
    },
  },
  {
    deps: ["maitre1.courriel"],
    process: async ({ values }) => {
      const {
        maitre1: { courriel },
      } = values.maitre1.courriel;

      return emailControl(courriel);
    },
  },
  {
    deps: ["maitre2.courriel"],
    process: async ({ values }) => {
      const {
        maitre2: { courriel },
      } = values;

      return emailControl(courriel);
    },
  },
];
