import { zRoutes } from "shared";

import { getDocumentColumns, getDocumentSample, getDocumentTypes } from "../actions/documents.actions";
import { Server } from "./server";

export const documentsRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/documents/types",
    {
      schema: zRoutes.get["/documents/types"],
      onRequest: [server.auth(zRoutes.get["/documents/types"])],
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
      onRequest: [server.auth(zRoutes.get["/documents/columns"])],
    },
    async (request, response) => {
      const types = await getDocumentColumns(request.query.type);

      return response.status(200).send(types);
    }
  );

  server.get(
    "/documents/sample",
    {
      schema: zRoutes.get["/documents/sample"],
      onRequest: [server.auth(zRoutes.get["/documents/sample"])],
    },
    async (request, response) => {
      const sample = await getDocumentSample(request.query.type);

      return response.status(200).send(sample);
    }
  );
};
