// Pour chaque template, déclarer les champs qui sont utilisés dans le template
// token: string; // obligatoire et commun à tous les emails, ajouté automatiquement dans l'emails.actions

import { z } from "zod";

const zTemplateResetPassword = z
  .object({
    name: z.literal("reset_password"),
    recipient: z
      .object({
        civility: z.enum(["Madame", "Monsieur"]).optional(),
        prenom: z.string().optional(),
        nom: z.string().optional(),
        email: z.string().email(),
      })
      .strict(),
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
