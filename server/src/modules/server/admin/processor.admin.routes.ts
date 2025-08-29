import { getProcessorStatus } from "job-processor";
import { zRoutes } from "shared";
import type { Server } from "../server";

export const processorAdminRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/admin/processor",
    {
      schema: zRoutes.get["/admin/processor"],
      onRequest: [server.auth(zRoutes.get["/admin/processor"])],
    },
    async (_request, response) => {
      return response.status(200).send(await getProcessorStatus());
    }
  );
};
