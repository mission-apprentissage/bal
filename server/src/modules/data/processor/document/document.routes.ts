import { ObjectId } from "mongodb";
import {
  SReqPostProcessorDocument,
  SResPostProcessorDocument,
} from "shared/processor/document.routes";

import {
  findDocument,
  handleDocumentFileContent,
} from "../../../actions/documents.actions";
import { FastifyServer } from "../processor";

export const documentRoutes = ({ server }: { server: FastifyServer }) => {
  /**
   * Process uploaded document
   */
  server.post(
    "/document",
    {
      schema: {
        body: SReqPostProcessorDocument,
        response: { 200: SResPostProcessorDocument },
      } as const,
    },
    async (request, response) => {
      try {
        const document = await findDocument({
          _id: new ObjectId(request.body.document_id),
        });
        if (!document) {
          throw new Error("Processor > /document: Can't find document");
        }

        response.status(200).send({
          started: true,
        });

        await handleDocumentFileContent(document);
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
