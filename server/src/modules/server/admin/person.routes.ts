import { Filter, ObjectId } from "mongodb";
import { IPerson } from "shared/models/person.model";
import { SReqParamsSearchPagination } from "shared/routes/common.routes";
import {
  IResGetPerson,
  SReqPatchPerson,
  SResGetPerson,
  SResGetPersons,
} from "shared/routes/person.routes";

import {
  findPerson,
  findPersons,
  updatePerson,
} from "../../actions/persons.actions";
import { Server } from "..";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const personAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/persons",
    {
      schema: {
        response: { 200: SResGetPersons },
        querystring: SReqParamsSearchPagination,
      } as const,
      preHandler: [
        server.auth([server.validateJWT, server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        const filter: Filter<IPerson> = {};

        const { q = "" } = request.query;

        if (q) {
          filter.$text = { $search: q };
        }

        const persons = await findPersons(filter);

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
        const person = await findPerson({
          _id: new ObjectId(request.params.id),
        });

        return response.status(200).send(person as IResGetPerson);
      } catch (error) {
        response.log.error(error);
      }
    }
  );

  server.patch(
    "/admin/persons/:id",
    {
      schema: {
        body: SReqPatchPerson,
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
        const person = await findPerson({
          _id: new ObjectId(request.params.id),
        });

        if (!person) {
          return response.status(404).send();
        }

        await updatePerson(person, request.body);

        return response.status(200).send();
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
