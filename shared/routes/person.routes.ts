import { z } from "zod";

import { zObjectId } from "../models/common";
import { ZPersonWithOrganisation } from "../models/person.model";
import { ZReqParamsSearchPagination } from "./common.routes";

export const zPersonRoutes = {
  get: {
    "/admin/persons": {
      querystring: ZReqParamsSearchPagination,
      response: {
        "2xx": z.array(ZPersonWithOrganisation),
      },
    },
    "/admin/persons/:id": {
      params: z.object({ id: zObjectId }).strict(),
      response: {
        "2xx": ZPersonWithOrganisation,
      },
    },
  },
  post: {},
  put: {},
  delete: {},
};
