import {
  SReqHeadersOrganisation,
  SReqPostOrganisationValidation,
  SResPostOrganisationValidation,
} from "shared/routes/organisation.routes";

import { validation } from "../actions/organisation.actions";
import { Server } from ".";

export const organisationRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/organisation/validation",
    {
      schema: {
        body: SReqPostOrganisationValidation,
        response: { 200: SResPostOrganisationValidation },
        headers: SReqHeadersOrganisation,
      } as const,
    },
    async (request, response) => {
      try {
        const { email } = request.body;
        const is_valid = await validation(email);
        return response.status(200).send({ is_valid });
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
