import { z } from "zod";

import { extensions } from "../../helpers/zodHelpers/zodPrimitives";
import { ZReqHeadersAuthorization } from "../common.routes";

export const zOrganisationV1Routes = {
  get: {},
  post: {
    "/v1/organisation/validation": {
      body: z
        .object({
          email: z.string().trim().email("Email non valide"),
          siret: extensions.siret(),
        })
        .describe("Organisation validation Request body")
        .strict(),
      headers: ZReqHeadersAuthorization,
      response: {
        "2xx": z
          .object({
            is_valid: z.boolean(),
            on: z.enum(["email", "domain"]).optional(),
          })
          .strict()
          .describe("Organisation validation Response body"),
      },
    },
  },
  put: {},
  delete: {},
};
