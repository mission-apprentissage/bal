import { z } from "zod/v4-mini";
import { extensions } from "../../helpers/zodHelpers/zodPrimitives";
import type { IRoutesDef } from "../common.routes";
import { ZReqHeadersAuthorization } from "../common.routes";

const validationSchema = {
  body: z.object({
    siret: extensions.siret,
  }),
  headers: ZReqHeadersAuthorization,
  response: {
    "200": z.object({
      contrats: z.object({
        total: z.number(),
        appr: z.number(),
        prof: z.number(),
      }),
      premier_contrat: z.nullish(
        z.object({
          date_debut_contrat: z.optional(z.date()),
          date_fin_contrat: z.optional(z.date()),
        })
      ),
      dernier_contrat: z.nullish(
        z.object({
          date_debut_contrat: z.optional(z.date()),
          date_fin_contrat: z.optional(z.date()),
        })
      ),
    }),
  },
} as const;

export const zDecaV1Routes = {
  post: {
    "/v1/deca/search/organisme": {
      method: "post",
      path: "/v1/deca/search/organisme",
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
  },
} as const satisfies IRoutesDef;
