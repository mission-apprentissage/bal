import { ObjectId } from "mongodb";
import {
  SReqPostProcessorMailingList,
  SResPostProcessorMailingList,
} from "shared/processor/mailingList.routes";

import {
  createMailingListFile,
  findMailingList,
} from "../../../actions/mailingLists.actions";
import { FastifyServer } from "../processor";

export const mailingListRoutes = ({ server }: { server: FastifyServer }) => {
  /**
   * Process uploaded mailingList
   */
  server.post(
    "/mailing-list",
    {
      schema: {
        body: SReqPostProcessorMailingList,
        response: { 200: SResPostProcessorMailingList },
      } as const,
    },
    async (request, response) => {
      try {
        const mailingList = await findMailingList({
          _id: new ObjectId(request.body.mailing_list_id),
        });

        if (!mailingList) {
          throw new Error("Processor > /mailing-list: Can't find mailing list");
        }

        response.status(200).send({
          started: true,
        });

        await createMailingListFile(mailingList);
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
