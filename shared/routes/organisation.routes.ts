import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZOrganisation } from "../models/organisation.model";
import { ZReqParamsSearchPagination } from "./common.routes";

export const zAdminOrganisationRoutes = {
  get: {
    "/admin/organisations": {
      querystring: ZReqParamsSearchPagination,
      response: {
        "2xx": z.array(ZOrganisation),
      },
    },
    "/admin/organisations/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": ZOrganisation,
      },
    },
  },
  post: {},
  put: {},
  delete: {},
};
