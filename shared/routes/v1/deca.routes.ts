import { extensions } from "../../helpers/zodHelpers/zodPrimitives";
import { z } from "../../helpers/zodWithOpenApi";
import type { IRoutesDef } from "../common.routes";
import { ZReqHeadersAuthorization } from "../common.routes";

const validationSchema = {
  body: z
    .object({
      siret: extensions.siret,
    })
    .describe("Organisation deca Request body"),
  headers: ZReqHeadersAuthorization,
  response: {
    "200": z
      .object({
        contrats: z.object({
          total: z.number(),
          appr: z.number(),
          prof: z.number(),
        }),
        premier_contrat: z
          .object({
            date_debut_contrat: z.date().optional(),
            date_fin_contrat: z.date().optional(),
          })

          .nullish(),
        dernier_contrat: z
          .object({
            date_debut_contrat: z.date().optional(),
            date_fin_contrat: z.date().optional(),
          })

          .nullish(),
      })

      .describe("Organisation deca Response body"),
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
