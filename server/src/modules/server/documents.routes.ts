import { zRoutes } from "shared";

import {
  getDocumentColumns,
  getDocumentTypes,
} from "../actions/documents.actions";
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

  server.get(
    "/documents/columns",
    {
      schema: zRoutes.get["/documents/columns"],
      preHandler: [server.auth([server.validateSession])],
    },
    async (request, response) => {
      console.log(request.query);
      const types = await getDocumentColumns(request.query.type);

      return response.status(200).send(types);
    }
  );
};
