import { CerfaControl } from ".";

const control = (phone: string, emptyError?: string) => {
  if (!phone) {
    return {};
  }

  if (phone === "+33") {
    if (emptyError) {
      return {
        error: emptyError,
      };
    }

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

      return control(telephone, "Le téléphone de l'employeur est manquant");
    },
  },
  {
    deps: ["apprenti.telephone"],
    process: async ({ values }) => {
      const {
        apprenti: { telephone },
      } = values;

      return control(telephone);
    },
  },
];
