import { forbidden } from "@hapi/boom";
import { ObjectId } from "mongodb";
import { zRoutes } from "shared";

import { findPerson, findPersons } from "../../actions/persons.actions";
import type { Server } from "../server";

export const personAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/persons",
    {
      schema: zRoutes.get["/admin/persons"],
      onRequest: [server.auth(zRoutes.get["/admin/persons"])],
    },
    async (request, response) => {
      const { q = "" } = request.query;

      const persons = await findPersons(q ? { $text: { $search: q } } : null);

      return response.status(200).send(persons);
    }
  );

  server.get(
    "/admin/persons/:id",
    {
      schema: zRoutes.get["/admin/persons/:id"],
      onRequest: [server.auth(zRoutes.get["/admin/persons/:id"])],
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
