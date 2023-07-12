import { MultipartFile } from "@fastify/multipart";
import Boom from "@hapi/boom";
import { ObjectId } from "mongodb";
import { SResError } from "shared/routes/common.routes";
import {
  IResGetDocuments,
  IResGetDocumentTypes,
  IResPostAdminUpload,
  SReqQueryPostAdminUpload,
  SResGetDocuments,
  SResGetDocumentTypes,
  SResPostAdminUpload,
} from "shared/routes/upload.routes";

import logger from "@/common/logger";

import { FILE_SIZE_LIMIT } from "../../../../../shared/constants/index";
import {
  createEmptyDocument,
  deleteDocumentById,
  findDocuments,
  getDocumentTypes,
  uploadFile,
} from "../../actions/documents.actions";
import { addJob } from "../../jobs/jobs";
import { Server } from "../server";
import { ensureUserIsAdmin } from "../utils/middleware.utils";

const validateFile = (file: MultipartFile) => {
  if (
    file.mimetype !==
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
    file.mimetype !== "application/vnd.ms-excel" &&
    file.mimetype !== "text/csv"
  ) {
    return false;
  }

  if (
    !file.filename.endsWith(".xlsx") &&
    !file.filename.endsWith(".xls") &&
    !file.filename.endsWith(".csv")
  ) {
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
      schema: {
        querystring: SReqQueryPostAdminUpload,
        response: {
          200: SResPostAdminUpload,
          401: SResError,
        },
      } as const,
      preHandler: [
        server.auth([server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      const { type_document } = request.query;
      const fileSize = parseInt(request.headers["content-length"] ?? "0");

      let data = null as any;
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

      let document = null as any;

      document = await createEmptyDocument({
        type_document,
        fileSize,
        filename: data.filename,
      });

      if (!document) {
        throw Boom.badImplementation("Impossible de stocker de le fichier");
      }

      try {
        const added_by = request.user._id.toString();

        await uploadFile(added_by, data.file, document._id, {
          mimetype: data.mimetype,
        });

        await addJob({
          name: "import:document",
          payload: {
            document_id: document._id,
          },
        });

        return response
          .status(200)
          .send(document as unknown as IResPostAdminUpload);
      } catch (error) {
        const err = server.multipartErrors;
        logger.debug(err);
        throw Boom.badImplementation(error as Error);
      }
    }
  );

  server.get(
    "/admin/documents",
    {
      schema: {
        response: {
          200: SResGetDocuments,
        },
      } as const,
      preHandler: [
        server.auth([server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (_request, response) => {
      const documents = (await findDocuments(
        { import_progress: { $exists: true } },
        { projection: { hash_secret: 0, hash_fichier: 0 } }
      )) as IResGetDocuments;

      return response.status(200).send(documents as any); // TODO
    }
  );

  server.delete<{
    Params: { id: string };
  }>(
    "/admin/document/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      },
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (request, response) => {
      await deleteDocumentById(new ObjectId(request.params.id));

      return response.status(200).send({ success: true });
    }
  );

  server.get<{
    Reply: {
      200: IResGetDocumentTypes;
    };
  }>(
    "/admin/documents/types",
    {
      schema: {
        response: {
          200: SResGetDocumentTypes,
        },
      },
      preHandler: [server.auth([server.validateSession]), ensureUserIsAdmin],
    },
    async (_request, response) => {
      const types: IResGetDocumentTypes = await getDocumentTypes();

      return response.status(200).send(types);
    }
  );
};
