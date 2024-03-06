import { CerfaControl } from ".";

const control = (phone: string) => {
  if (!phone) {
    return {};
  }

  // +33XXXXXXXXX
  if (phone.length < 12) {
    return {
      error: "Chiffres manquants pour que le numéro soit valide",
    };
  }

  return {};
};

export const telephoneControl: CerfaControl[] = [
  {
    deps: ["employeur.telephone"],
    process: async ({ values }) => {
      const {
        employeur: { telephone },
      } = values;

      return control(telephone.value);
    },
  },
  {
    deps: ["apprenti.telephone"],
    process: async ({ values }) => {
      const {
        apprenti: { telephone },
      } = values;

      return control(telephone.value);
    },
  },
];
