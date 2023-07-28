import { forbidden } from "@hapi/boom";
import { ObjectId, RootFilterOperators } from "mongodb";
import { zRoutes } from "shared";
import { IPerson } from "shared/models/person.model";

import { findPerson, findPersons } from "../../actions/persons.actions";
import { Server } from "../server";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const personAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/persons",
    {
      schema: zRoutes.get["/admin/persons"],
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const filter: RootFilterOperators<IPerson> = {};

      const { q = "" } = request.query;

      if (q) {
        filter.$text = { $search: q };
      }

      const persons = await findPersons(filter);

      return response.status(200).send(persons);
    }
  );

  server.get(
    "/admin/persons/:id",
    {
      schema: zRoutes.get["/admin/persons/:id"],
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const person = await findPerson({
        _id: new ObjectId(request.params.id),
      });

      if (!person) {
        throw forbidden();
      }

      return response.status(200).send(person);
    }
  );
};
