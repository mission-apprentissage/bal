import { z } from "zod/v4-mini"
import { extensions } from "../../helpers/zodHelpers/zodPrimitives"
import type { IRoutesDef } from "../common.routes"
import { ZReqHeadersAuthorization } from "../common.routes"

const zValidationExternalSource = z.enum(["akto", "opco_ep"])
export type IValidationExternalSource = z.output<typeof zValidationExternalSource>

const validationSchema = {
  body: z.object({
    email: extensions.email,
    siret: extensions.siret,
  }),
  headers: ZReqHeadersAuthorization,
  response: {
    // `is_valid` est conservé pour les consommateurs qui ne lisent pas `status`.
    // `indeterminate` : aucune étape n'a validé et au moins un fournisseur n'a pas répondu, le refus n'est pas concluant.
    "200": z.discriminatedUnion("status", [
      z.object({
        status: z.literal("valid"),
        is_valid: z.literal(true),
        on: z.optional(z.enum(["email", "domain"])),
        // Valeurs en minuscules, identiques à `unavailable_sources` pour les fournisseurs (`akto`, `opco_ep`).
        sources: z.array(z.string()),
      }),
      z.object({
        status: z.literal("invalid"),
        is_valid: z.literal(false),
        is_company_email: z.boolean(),
      }),
      z.object({
        status: z.literal("indeterminate"),
        is_valid: z.literal(false),
        is_company_email: z.boolean(),
        unavailable_sources: z.array(zValidationExternalSource).check(z.minLength(1)),
      }),
    ]),
  },
} as const

export const zOrganisationV1Routes = {
  post: {
    "/v1/organisation/validation": {
      method: "post",
      path: "/v1/organisation/validation",
      securityScheme: {
        auth: "api-key",
        ressources: {},
        access: null,
      },
      openapi: {
        tags: ["v1"] as string[],
      },
      ...validationSchema,
    },
    "/test/v1/organisation/validation": {
      method: "post",
      path: "/test/v1/organisation/validation",
      ...validationSchema,
      securityScheme: {
        auth: "cookie-session",
        ressources: {},
        access: null,
      },
    },
  },
} as const satisfies IRoutesDef
