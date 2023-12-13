import Boom from "@hapi/boom";
import { zTcoRoutes } from "shared/routes/v1/tco.route";

import { findCfd, findRncp } from "../../../common/apis/tco";
import { Server } from "../server";

export const tcoRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/cfdrncp",
    {
      schema: zTcoRoutes.post["/v1/cfdrncp"],
    },
    async (request, response) => {
      const { cfd, rncp } = request.body;
      if (!cfd && !rncp) {
        return response.send({ error: "Cfd ou rncp doivent être défini et formaté" });
      }
      if (cfd) {
        const { data } = await findCfd(cfd);
        if (data.messages.error) {
          throw Boom.notFound(data.messages.error);
        }
        return response.status(200).send(data);
      } else if (rncp) {
        const { data } = await findRncp(rncp);

        if (data.messages.error) {
          throw Boom.notFound(data.messages.error);
        }

        return response.status(200).send(data);
      }

      return response.status(404).send({ message: "Something went wrong" });
    }
  );
};
