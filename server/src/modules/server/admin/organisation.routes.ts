import { notFound } from "@hapi/boom";
import { zRoutes } from "shared";

import { findOrganisation, findOrganisations } from "../../actions/organisations.actions";
import { Server } from "../server";

export const organisationAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/organisations",
    {
      schema: zRoutes.get["/admin/organisations"],
      onRequest: [server.auth(zRoutes.get["/admin/organisations"])],
    },
    async (request, response) => {
      const { q = "" } = request.query;

      const organisations = await findOrganisations(q ? { $text: { $search: q } } : null);

      return response.status(200).send(organisations);
    }
  );

  server.get(
    "/admin/organisations/:id",
    {
      schema: zRoutes.get["/admin/organisations/:id"],
      onRequest: [server.auth(zRoutes.get["/admin/organisations/:id"])],
    },
    async (request, response) => {
      const organisation = await findOrganisation({
        _id: request.params.id,
      });

      if (!organisation) {
        throw notFound();
      }

      return response.status(200).send(organisation);
    }
  );
};
