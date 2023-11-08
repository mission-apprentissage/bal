import { extensions } from "../../helpers/zodHelpers/zodPrimitives";
import { z } from "../../helpers/zodWithOpenApi";
import { IRoutesDef, ZReqHeadersAuthorization } from "../common.routes";

export const zOrganisationV1Routes = {
  post: {
    "/v1/organisation/validation": {
      method: "post",
      path: "/v1/organisation/validation",
      body: z
        .object({
          email: z.string().trim().email("Email non valide"),
          siret: extensions.siret,
        })
        .describe("Organisation validation Request body")
        .strict(),
      headers: ZReqHeadersAuthorization,
      response: {
        "200": z
          .object({
            is_valid: z.boolean(),
            on: z.enum(["email", "domain"]).optional(),
          })
          .strict()
          .describe("Organisation validation Response body"),
      },
      securityScheme: {
        auth: "api-key",
        ressources: {},
        access: null,
      },
      openapi: {
        tags: ["v1"] as string[],
      },
    },
  },
} as const satisfies IRoutesDef;
