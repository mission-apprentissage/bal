import { ObjectId } from "mongodb";
import {
  IResGetPerson,
  SResGetPerson,
  SResGetPersons,
} from "shared/routes/person.routes";

import { findPerson, findPersons } from "../../actions/persons.actions";
import { Server } from "..";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const personAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/persons",
    {
      schema: {
        response: { 200: SResGetPersons },
      } as const,
      preHandler: [
        server.auth([server.validateJWT, server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        const persons = await findPersons();

        console.log(persons);

        return response.status(200).send(persons);
      } catch (error) {
        response.log.error(error);
      }
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
        server.auth([server.validateJWT, server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        console.log({ id: request.params.id });
        const person = await findPerson({
          _id: new ObjectId(request.params.id),
        });

        return response.status(200).send(person as IResGetPerson);
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
