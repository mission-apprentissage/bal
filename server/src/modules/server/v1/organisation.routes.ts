import Boom from "@hapi/boom";
import {
  IReqPostOrganisationValidation,
  IResOrganisationValidation,
  SReqHeadersOrganisation,
  SReqPostOrganisationValidation,
  SResPostOrganisationValidation,
  ZReqPostOrganisationValidation,
} from "shared/routes/v1/organisation.routes";

import config from "../../../config";
import { validation } from "../../actions/organisations.actions";
import { Server } from "../server";

export const organisationRoutes = ({ server }: { server: Server }) => {
  server.post<{
    Body: IReqPostOrganisationValidation;
    Reply: IResOrganisationValidation;
  }>(
    "/organisation/validation",
    {
      schema: {
        body: SReqPostOrganisationValidation,
        response: {
          200: SResPostOrganisationValidation,
        },
        headers: SReqHeadersOrganisation,
        security: [
          {
            apiKey: [],
          },
        ],
      },
      preHandler: [
        server.auth([
          async (request, _reply, ...arg) => {
            if (
              request.headers.referer === `${config.publicUrl}/usage/validation`
            ) {
              return server.validateSession(request, _reply, ...arg);
            }
            return server.validateJWT(request, _reply, ...arg);
          },
        ]),

        async (request, _reply) => {
          try {
            await ZReqPostOrganisationValidation().parseAsync(request.body);
          } catch (error) {
            throw Boom.badRequest(error as Error);
          }
        },
      ],
    },
    async (request, response) => {
      const { email, siret } = request.body;

      try {
        const res = await validation({ email: email.toLowerCase(), siret });
        return response.status(200).send(res);
      } catch (error) {
        throw Boom.badImplementation(error as Error);
      }
    }
  );
};
