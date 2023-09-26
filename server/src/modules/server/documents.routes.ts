import { zRoutes } from "shared";

import { getDocumentTypes } from "../actions/documents.actions";
import { Server } from "./server";

export const documentsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/documents/types",
    {
      schema: zRoutes.get["/documents/types"],
      preHandler: [server.auth([server.validateSession])],
    },
    async (_request, response) => {
      const types = await getDocumentTypes();

      return response.status(200).send(types);
    }
  );
};
