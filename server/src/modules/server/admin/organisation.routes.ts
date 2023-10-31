import { notFound } from "@hapi/boom";
import { RootFilterOperators } from "mongodb";
import { zRoutes } from "shared";
import { IOrganisation } from "shared/models/organisation.model";

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
      const filter: RootFilterOperators<IOrganisation> = {};

      const { q } = request.query;

      if (q) {
        filter.$text = { $search: q };
      }

      const organisations = await findOrganisations(filter);

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
