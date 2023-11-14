import { zCerfaRoutes } from "shared/routes/v1/cerfa.route";

import { createCerfaPdf } from "../../actions/cerfa.actions";
import { Server } from "../server";

export const cerfaRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/cerfa",
    {
      schema: zCerfaRoutes.post["/v1/cerfa"],
    },
    async (request, response) => {
      const values = request.body;

      const pdfBase64 = await createCerfaPdf(values as Record<string, any>);

      return response.status(200).send({ content: pdfBase64 });
    }
  );
};
