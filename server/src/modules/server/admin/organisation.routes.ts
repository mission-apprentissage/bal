import { notFound } from "@hapi/boom";
import { zRoutes } from "shared";
import type { Server } from "../server";
import { getDbCollection } from "../../../common/utils/mongodbUtils";

export const organisationAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/organisations",
    {
      schema: zRoutes.get["/admin/organisations"],
      onRequest: [server.auth(zRoutes.get["/admin/organisations"])],
    },
    async (request, response) => {
      const { q = "", page = 1, limit = 100 } = request.query;
      const filter = q
        ? {
            $or: [{ siren: { $regex: q, $options: "i" } }, { email_domain: { $regex: q, $options: "i" } }],
          }
        : {};

      const [organisations, count] = await Promise.all([
        getDbCollection("organisations")
          .find(filter, {
            skip: (page - 1) * limit,
            limit,
            sort: { created_at: 1 },
          })
          .toArray(),
        getDbCollection("organisations").countDocuments(filter),
      ]);

      return response.status(200).send({ organisations, pagination: { total: count, page, size: limit } });
    }
  );

  server.get(
    "/admin/organisations/:id",
    {
      schema: zRoutes.get["/admin/organisations/:id"],
      onRequest: [server.auth(zRoutes.get["/admin/organisations/:id"])],
    },
    async (request, response) => {
      const organisation = await getDbCollection("organisations").findOne({
        _id: request.params.id,
      });

      if (!organisation) {
        throw notFound();
      }

      return response.status(200).send(organisation);
    }
  );
};
