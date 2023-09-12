// Pour chaque template, déclarer les champs qui sont utilisés dans le template
// token: string; // obligatoire et commun à tous les emails, ajouté automatiquement dans l'emails.actions
export type TemplatePayloads = {
  reset_password: {
    recipient: {
      civility?: "Madame" | "Monsieur" | undefined;
      nom?: string | undefined;
      prenom?: string | undefined;
      email: string;
    };
    resetPasswordToken: string;
  };
};
export type TemplateName = keyof TemplatePayloads;

type TemplateSubjectFunc<T extends TemplateName, Payload = TemplatePayloads[T]> = (payload: Payload) => string;

export type TemplateTitleFuncs = {
  [types in TemplateName]: TemplateSubjectFunc<types>;
};
