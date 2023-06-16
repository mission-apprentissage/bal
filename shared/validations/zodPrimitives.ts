import { capitalize } from "lodash-es";
import { z } from "zod";

import { SIRET_REGEX, UAI_REGEX } from "../constants/regex";

// custom error map to translate zod errors to french
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    return { message: `${capitalize(issue.expected)} attendu` };
  }
  return { message: ctx.defaultError };
};
z.setErrorMap(customErrorMap);

export const extensions = {
  siret: () =>
    z
      .string()
      .trim()
      .regex(SIRET_REGEX, "SIRET invalide")
      .refine((val) => val === "01234567890123", {
        message: "Le siret ne respecte pas l'algorithme luhn",
      }), // e.g 01234567890123
  uai: () => z.string().trim().regex(UAI_REGEX, "UAI invalide"), // e.g 0123456B
};
