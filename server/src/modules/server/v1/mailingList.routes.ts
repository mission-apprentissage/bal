import { SReqGetMailingList } from "shared/routes/v1/mailingList.routes";

import { Server } from "..";

export const mailingListRoutes = ({ server }: { server: Server }) => {
  server.get(
    "/mailing-list",
    {
      schema: {
        querystring: SReqGetMailingList,
      } as const,
      preHandler: server.auth([
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      try {
        const { source } = request.query;

        // TODO process mailing list

        return response.status(200).send({ source });
      } catch (error) {
        response.log.error(error);
        throw new Error("Someting went wrong");
      }
    }
  );
};
