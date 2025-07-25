// Pour chaque template, déclarer les champs qui sont utilisés dans le template
// token: string; // obligatoire et commun à tous les emails, ajouté automatiquement dans l'emails.actions

import { z } from "zod/v4-mini";

// Ignore any extra props added by jwt parsing (iat, iss, ...)
const zTemplateResetPassword = z.object({
  name: z.literal("reset_password"),
  to: z.email(),
  civility: z.nullish(z.enum(["Madame", "Monsieur"])),
  nom: z.nullish(z.string()),
  prenom: z.nullish(z.string()),
  resetPasswordToken: z.string(),
});

type ITemplateResetPassword = z.output<typeof zTemplateResetPassword>;

export const zTemplate = z.discriminatedUnion("name", [zTemplateResetPassword]);

export type ITemplate = z.output<typeof zTemplate>;

export type TemplatePayloads = {
  reset_password: ITemplateResetPassword;
};
export type TemplateName = keyof TemplatePayloads;
