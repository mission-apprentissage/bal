// Pour chaque template, déclarer les champs qui sont utilisés dans le template
// token: string; // obligatoire et commun à tous les emails, ajouté automatiquement dans l'emails.actions

import { z } from "zod/v4-mini";

// Ignore any extra props added by jwt parsing (iat, iss, ...)
const zTemplateResetPassword = z.object({
  name: z.literal("reset_password"),
  to: z.email(),
  resetPasswordToken: z.string(),
});

export const zTemplate = z.discriminatedUnion("name", [zTemplateResetPassword]);

export type ITemplate = z.output<typeof zTemplate>;
