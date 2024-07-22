import { MultipartFile } from "@fastify/multipart";
import Boom from "@hapi/boom";
import { addJob } from "job-processor";
import { ObjectId } from "mongodb";
import { zRoutes } from "shared";
import { FILE_SIZE_LIMIT } from "shared/constants/index";
import { IDocument, IUploadDocument, toPublicDocument } from "shared/models/document.model";

import logger from "@/common/logger";

import { getUserFromRequest } from "../../../security/authenticationService";
import {
  createUploadDocument,
  deleteDocumentById,
  findDocuments,
  getDocumentTypes,
  updateDocument,
  uploadFile,
} from "../../actions/documents.actions";
import { findMailingListWithDocument } from "../../actions/mailingLists.actions";
import { Server } from "../server";

const validateFile = (file: MultipartFile) => {
  if (file.mimetype !== "text/csv") {
    return false;
  }

  if (!file.filename.endsWith(".csv")) {
    return false;
  }

  return true;
};

export const uploadAdminRoutes = ({ server }: { server: Server }) => {
  /**
   * Importer un fichier
   */
  server.post(
    "/admin/upload",
    {
      schema: zRoutes.post["/admin/upload"],
      onRequest: [server.auth(zRoutes.post["/admin/upload"])],
    },
    async (request, response) => {
      const user = getUserFromRequest(request, zRoutes.post["/admin/upload"]);
      const { type_document, delimiter } = request.query;
      const fileSize = parseInt(request.headers["content-length"] ?? "0");

      let data: MultipartFile | null | undefined = null;
      try {
        data = await request.file({
          limits: {
            fileSize: FILE_SIZE_LIMIT,
          },
        });
      } catch (error) {
        const err = server.multipartErrors;
        logger.debug(err);
        throw Boom.badImplementation(error as Error);
      }

      if (!data || !validateFile(data)) {
        throw Boom.unauthorized("Le fichier n'est pas au bon format");
      }

      const document = await createUploadDocument({
        type_document,
        fileSize,
        filename: data.filename as `${string}.${IDocument["ext_fichier"]}`,
        delimiter,
        added_by: user._id,
      });

      if (!document) {
        throw Boom.badImplementation("Impossible de stocker de le fichier");
      }

      try {
        const added_by = getUserFromRequest(request, zRoutes.post["/admin/upload"])._id.toString();

        await uploadFile(added_by, data.file, document, {
          mimetype: data.mimetype,
        });

        await addJob({
          name: "import:document",
          payload: {
            document_id: document._id,
          },
          queued: true,
        });

        return response.status(200).send(toPublicDocument(document));
      } catch (error) {
        await updateDocument(document._id, {
          $set: {
            job_status: "error",
          },
        });

        if (error.isBoom) {
          throw error;
        }

        const err = server.multipartErrors;
        logger.debug(err);
        throw Boom.badImplementation(error as Error);
      }
    }
  );

  server.get(
    "/admin/documents",
    {
      schema: zRoutes.get["/admin/documents"],
      onRequest: [server.auth(zRoutes.get["/admin/documents"])],
    },
    async (_request, response) => {
      const documents = await findDocuments<IUploadDocument>(
        {
          kind: "upload",
        },
        {
          sort: {
            created_at: -1,
          },
        }
      );

      return response.status(200).send(documents.map(toPublicDocument));
    }
  );
  server.get(
    "/admin/mailing-list/:user_id",
    {
      schema: zRoutes.get["/admin/mailing-list/:user_id"],
      onRequest: [server.auth(zRoutes.get["/admin/mailing-list/:user_id"])],
    },
    async (request, response) => {
      const mailingLists = await findMailingListWithDocument({
        added_by: request.params.user_id.toString(),
      });

      return response.status(200).send(mailingLists);
    }
  );

  server.delete(
    "/admin/document/:id",
    {
      schema: zRoutes.delete["/admin/document/:id"],
      onRequest: [server.auth(zRoutes.delete["/admin/document/:id"])],
    },
    async (request, response) => {
      await deleteDocumentById(new ObjectId(request.params.id));

      return response.status(200).send({ success: true });
    }
  );

  server.get(
    "/admin/documents/types",
    {
      schema: zRoutes.get["/admin/documents/types"],
      onRequest: [server.auth(zRoutes.get["/admin/documents/types"])],
    },
    async (_request, response) => {
      const types = await getDocumentTypes();

      return response.status(200).send(types);
    }
  );
};
