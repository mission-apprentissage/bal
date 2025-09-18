import { z } from "zod/v4-mini";
import { extensions } from "../../helpers/zodHelpers/zodPrimitives";
import type { IRoutesDef } from "../common.routes";
import { ZReqHeadersAuthorization } from "../common.routes";

const validationSchema = {
  body: z.object({
    email: extensions.email,
    siret: extensions.siret,
  }),
  headers: ZReqHeadersAuthorization,
  response: {
    "200": z.discriminatedUnion("is_valid", [
      z.object({
        is_valid: z.literal(true),
        on: z.optional(z.enum(["email", "domain"])),
        sources: z.array(z.string()),
      }),
      z.object({
        is_valid: z.literal(false),
        is_company_email: z.boolean(),
      }),
    ]),
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
