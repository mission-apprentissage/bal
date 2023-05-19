import { ObjectId } from "mongodb";
import {
  IResGetOrganisation,
  SResGetOrganisation,
  SResGetOrganisations,
} from "shared/routes/organisation.routes";

import {
  findOrganisation,
  findOrganisations,
} from "../../actions/organisations.actions";
import { Server } from "..";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

export const organisationAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/organisations",
    {
      schema: {
        response: { 200: SResGetOrganisations },
      } as const,
      preHandler: [
        server.auth([server.validateJWT, server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        const organisations = await findOrganisations();

        return response.status(200).send(organisations);
      } catch (error) {
        response.log.error(error);
      }
    }
  );

  server.get(
    "/admin/organisations/:id",
    {
      schema: {
        response: { 200: SResGetOrganisation },
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
        const organisation = await findOrganisation({
          _id: new ObjectId(request.params.id),
        });

        return response.status(200).send(organisation as IResGetOrganisation);
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
