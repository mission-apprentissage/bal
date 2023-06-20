import { FromSchema } from "json-schema-to-ts";
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

export const SResPostOrganisationValidation = {
  type: "object",
  properties: {
    is_valid: { type: "boolean" },
    on: { type: "string", enum: ["email", "domain"] },
  },
  required: ["is_valid"],
} as const;

export type IResOrganisationValidation = FromSchema<
  typeof SResPostOrganisationValidation
>;

export const SReqHeadersOrganisation = {
  type: "object",
  properties: {
    Authorization: { type: "string" },
  },
};
