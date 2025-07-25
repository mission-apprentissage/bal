import Boom from "@hapi/boom";
import { zRoutes } from "shared";

import type { Server } from "../server";
import { validation } from "../../actions/validation.action";

export const organisationRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/v1/organisation/validation",
    {
      schema: zRoutes.post["/v1/organisation/validation"],
      onRequest: [server.auth(zRoutes.post["/v1/organisation/validation"])],
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
  server.post(
    "/test/v1/organisation/validation",
    {
      schema: zRoutes.post["/test/v1/organisation/validation"],
      onRequest: [server.auth(zRoutes.post["/test/v1/organisation/validation"])],
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
