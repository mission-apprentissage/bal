import { zCerfaRoutes } from "shared/routes/v1/cerfa.route";

import { createCerfaPdf, createCerfaZip } from "../../actions/cerfa.actions";
import { Server } from "../server";

export const cerfaRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/cerfa",
    {
      schema: zCerfaRoutes.post["/v1/cerfa"],
    },
    async (request, response) => {
      const { values, errors, output } = request.body;
      const { include_guide: includeGuide, include_errors: includeErrors } = output ?? {};

      const cerfa = await createCerfaPdf(values);

      const isZip = includeGuide || includeErrors;

      if (isZip) {
        const zip = await createCerfaZip(cerfa as Buffer, errors, {
          includeErrors: includeErrors as boolean,
          includeGuide: includeGuide as boolean,
        });

        // send zip
        return response.status(200).type("application/zip").send(zip);
      }

      // send pdf
      return response.status(200).type("application/pdf").send(cerfa);
    }
  );
};
