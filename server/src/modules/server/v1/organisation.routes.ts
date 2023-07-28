import Boom from "@hapi/boom";
import { zRoutes } from "shared";

import config from "../../../config";
import { validation } from "../../actions/organisations.actions";
import { Server } from "../server";

export const organisationRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/organisation/validation",
    {
      schema: zRoutes.post["/v1/organisation/validation"],
      preHandler: [
        server.auth([
          async function (request, ...arg) {
            if (
              request.headers.referer === `${config.publicUrl}/usage/validation`
            ) {
              return this.validateSession(request, ...arg);
            }
            return this.validateJWT(request, ...arg);
          },
        ]),
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
