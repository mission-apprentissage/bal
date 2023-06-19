import Boom from "@hapi/boom";
import {
  IReqPostOrganisationValidation,
  SReqHeadersOrganisation,
  SReqPostOrganisationValidation,
  SResPostOrganisationValidation,
  ZReqPostOrganisationValidation,
} from "shared/routes/v1/organisation.routes";

import { validation } from "../../actions/organisations.actions";
import { Server } from "../server";

export const organisationRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/organisation/validation",
    {
      // @ts-expect-error
      schema: {
        body: SReqPostOrganisationValidation,
        response: { 200: SResPostOrganisationValidation },
        headers: SReqHeadersOrganisation,
        security: [
          {
            apiKey: [],
          },
        ],
      } as const,
      preValidation: async (request, _reply) => {
        try {
          await ZReqPostOrganisationValidation().parseAsync(request.body);
        } catch (error: any) {
          throw Boom.badRequest(error);
        }
      },
      preHandler: server.auth([
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const { email, siret } = request.body as IReqPostOrganisationValidation;

      const res = await validation({ email: email.toLowerCase(), siret });
      return response.status(200).send(res);
    }
  );
};
