import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { extensions } from "../../helpers/zodHelpers/zodPrimitives";

export const ZReqPostOrganisationValidation = () =>
  z
    .object({
      email: z.string().trim().email("Email non valide"),
      siret: extensions.siret(),
    })
    .describe("Organisation validation Request body");

export type IReqPostOrganisationValidation = z.input<
  ReturnType<typeof ZReqPostOrganisationValidation>
>;

export const SReqPostOrganisationValidation = zodToJsonSchema(
  ZReqPostOrganisationValidation()
);

export const ZResPostOrganisationValidation = () =>
  z
    .object({
      is_valid: z.boolean(),
      on: z.enum(["email", "domain"]).optional(),
    })
    .strict()
    .describe("Organisation validation Response body");

export const SResPostOrganisationValidation = zodToJsonSchema(
  ZResPostOrganisationValidation()
);

export type IResOrganisationValidation = z.input<
  ReturnType<typeof ZResPostOrganisationValidation>
>;
