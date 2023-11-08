import { zGeoRoutes } from "shared/routes/v1/geo.route";

import { getDataFromCP } from "../../../common/utils/geoUtils";
import { Server } from "../server";

export const geoRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/geo/cp",
    {
      schema: zGeoRoutes.post["/v1/geo/cp"],
    },
    async (request, response) => {
      const { codePostal } = request.body;
      const result = await getDataFromCP(codePostal);

      return response.send(result);
    }
  );
};
