import { ObjectId, RootFilterOperators } from "mongodb";
import { IPerson } from "shared/models/person.model";
import {
  IReqParamsSearchPagination,
  SReqParamsSearchPagination,
} from "shared/routes/common.routes";
import { SResGetPerson, SResGetPersons } from "shared/routes/person.routes";

import { findPerson, findPersons } from "../../actions/persons.actions";
import { Server } from "../server";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const personAdminRoutes = ({ server }: { server: Server }) => {
  server.get<{
    Querystring: IReqParamsSearchPagination;
  }>(
    "/admin/persons",
    {
      schema: {
        response: { 200: SResGetPersons },
        querystring: SReqParamsSearchPagination,
      } as const,
      preHandler: [
        server.auth([server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      const filter: RootFilterOperators<IPerson> = {};

      const { q = "" } = request.query;

      if (q) {
        filter.$text = { $search: q };
      }

      const persons = await findPersons(filter);

      return response.status(200).send(persons as any);
    }
  );

  server.get(
    "/admin/persons/:id",
    {
      schema: {
        response: { 200: SResGetPerson },
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      } as const,
      preHandler: [
        server.auth([server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      const person = await findPerson({
        _id: new ObjectId(request.params.id),
      });

      return response.status(200).send(person as any); //IResGetPerson
    }
  );
};
