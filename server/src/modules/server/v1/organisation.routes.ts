import {
  SReqHeadersOrganisation,
  SReqPostOrganisationValidation,
  SResPostOrganisationValidation,
} from "shared/routes/v1/organisation.routes";

import { validation } from "../../actions/organisation.actions";
import { Server } from "..";

export const organisationRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/organisation/validation",
    {
      schema: {
        body: SReqPostOrganisationValidation,
        response: { 200: SResPostOrganisationValidation },
        headers: SReqHeadersOrganisation,
      } as const,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      preHandler: server.auth([server.validateJWT]) as any,
    },
    async (request, response) => {
      try {
        const { email, siret } = request.body;
        const res = await validation({ email, siret });
        return response.status(200).send(res);
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};