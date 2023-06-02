import { IUser } from "shared/models/user.model";
import { SReqGetMailingList } from "shared/routes/v1/mailingList.routes";

import { createMailingList } from "../../actions/mailingLists.actions";
import { processMailingList } from "../../apis/processor";
import { Server } from "..";

export const mailingListRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/mailing-list",
    {
      schema: {
        body: SReqGetMailingList,
      } as const,
      preHandler: server.auth([
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      try {
        const { source } = request.body;
        const user = request.user as IUser;

        const mailingList = await createMailingList({
          source,
          status: "pending",
          updated_at: new Date(),
          created_at: new Date(),
          user_id: user._id.toString(),
        });

        if (!mailingList) {
          throw new Error("Can't create mailing list");
        }

        await processMailingList(mailingList);

        return response.status(200).send(mailingList);
      } catch (error) {
        response.log.error(error);
        throw new Error("Someting went wrong");
      }
    }
  );
};
