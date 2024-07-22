import { extensions } from "../../helpers/zodHelpers/zodPrimitives";
import { z } from "../../helpers/zodWithOpenApi";
import { IRoutesDef, ZReqHeadersAuthorization } from "../common.routes";

const validationSchema = {
  body: z
    .object({
      email: z.string().trim().email("Email non valide"),
      siret: extensions.siret,
    })
    .describe("Organisation validation Request body"),
  headers: ZReqHeadersAuthorization,
  response: {
    "200": z
      .object({
        is_valid: z.boolean(),
        on: z.enum(["email", "domain"]).optional(),
      })

      .describe("Organisation validation Response body"),
  },
} as const;

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
} as const satisfies IRoutesDef;
