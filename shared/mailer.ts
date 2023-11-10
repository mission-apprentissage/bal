// Pour chaque template, déclarer les champs qui sont utilisés dans le template
// token: string; // obligatoire et commun à tous les emails, ajouté automatiquement dans l'emails.actions

import { z } from "zod";

const zTemplateResetPassword = z
  .object({
    name: z.literal("reset_password"),
    to: z.string().email(),
    civility: z.enum(["Madame", "Monsieur"]).nullish(),
    nom: z.string().nullish(),
    prenom: z.string().nullish(),
    resetPasswordToken: z.string(),
  })
  .strict();

type ITemplateResetPassword = z.output<typeof zTemplateResetPassword>;

export const zTemplate = z.discriminatedUnion("name", [zTemplateResetPassword]);

export type ITemplate = z.output<typeof zTemplate>;

export type TemplatePayloads = {
  reset_password: ITemplateResetPassword;
};
export type TemplateName = keyof TemplatePayloads;
