import { notFound } from "@hapi/boom";
import { zRoutes } from "shared";

import type { Server } from "../server";
import { getDbCollection } from "../../../common/utils/mongodbUtils";

export const personAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/persons",
    {
      schema: zRoutes.get["/admin/persons"],
      onRequest: [server.auth(zRoutes.get["/admin/persons"])],
    },
    async (request, response) => {
      const { q = "", page = 1, limit = 100 } = request.query;

      const filter = q
        ? {
            $or: [{ email: { $regex: q, $options: "i" } }, { siret: { $regex: q, $options: "i" } }],
          }
        : {};
      const [persons, count] = await Promise.all([
        getDbCollection("persons")
          .find(filter, {
            skip: (page - 1) * limit,
            limit,
            sort: { created_at: 1 },
          })
          .toArray(),
        getDbCollection("persons").countDocuments(filter),
      ]);

      return response.status(200).send({
        persons,
        pagination: {
          page,
          size: limit,
          total: count,
        },
      });
    }
  );

  server.get(
    "/admin/persons/:id",
    {
      schema: zRoutes.get["/admin/persons/:id"],
      onRequest: [server.auth(zRoutes.get["/admin/persons/:id"])],
    },
    async (request, response) => {
      const person = await getDbCollection("persons").findOne({
        _id: request.params.id,
      });

      if (!person) {
        throw notFound();
      }

      return response.status(200).send(person);
    }
  );
};
