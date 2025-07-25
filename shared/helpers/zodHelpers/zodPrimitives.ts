import { z } from "zod/v4-mini";
import { SIRET_REGEX, UAI_REGEX } from "../../constants/regex";
import { validateSIRET } from "../../validators/siretValidator";

export const extensions = {
  siret: z.pipe(
    z
      .pipe(
        z.string().check(z.regex(SIRET_REGEX, "SIRET does not match the format /^\\d{14}$/")),
        z.transform((value) => value.padStart(14, "0"))
      )
      .check(z.refine(validateSIRET, "SIRET does not pass the Luhn algorithm")),
    // Defines the `output` type of the zod (helps with type inference and schema generation)
    z.string().check(z.regex(/^\d{14}$/, "SIRET does not match the format /^\\d{14}$/"))
  ),
  uai: z.string().check(z.trim(), z.regex(UAI_REGEX, "UAI invalide")), // e.g 0123456B
  phone: z.string(),
  codeCommuneInsee: z.string().check(z.regex(/^([0-9]{2}|2A|2B)[0-9]{3}$/, "Format invalide")),
  email: z.pipe(z.string().check(z.trim(), z.toLowerCase()), z.email()),
};
