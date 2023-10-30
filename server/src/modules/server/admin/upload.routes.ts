import { MultipartFile } from "@fastify/multipart";
import Boom from "@hapi/boom";
import { ObjectId } from "mongodb";
import { zRoutes } from "shared";
import { FILE_SIZE_LIMIT } from "shared/constants/index";
import { IDocument, toPublicDocument } from "shared/models/document.model";

import logger from "@/common/logger";

import {
  createEmptyDocument,
  deleteDocumentById,
  findDocumentsWithImportJob,
  getDocumentTypes,
  uploadFile,
} from "../../actions/documents.actions";
import { addJob } from "../../jobs/jobs_actions";
import { Server } from "../server";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

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
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      const { type_document } = request.query;
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

      if (!request.user || !data || !validateFile(data)) {
        throw Boom.unauthorized("Le fichier n'est pas au bon format");
      }

      const document = await createEmptyDocument({
        type_document,
        fileSize,
        filename: data.filename as `${string}.${IDocument["ext_fichier"]}`,
      });

      if (!document) {
        throw Boom.badImplementation("Impossible de stocker de le fichier");
      }

      try {
        const added_by = request.user._id.toString();

        await uploadFile(added_by, data.file, document._id, {
          mimetype: data.mimetype,
        });

        if (request.query?.import_content === "true") {
          await addJob({
            name: "import:document",
            payload: {
              document_id: document._id,
            },
            queued: true,
          });
        }

        return response.status(200).send(toPublicDocument(document));
      } catch (error) {
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
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (_request, response) => {
      const documents = await findDocumentsWithImportJob({}, [
        {
          $sort: {
            created_at: -1,
          },
        },
      ]);

      return response.status(200).send(documents.map(toPublicDocument));
    }
  );

  server.delete(
    "/admin/document/:id",
    {
      schema: zRoutes.delete["/admin/document/:id"],
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
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
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (_request, response) => {
      const types = await getDocumentTypes();

      return response.status(200).send(types);
    }
  );
};
