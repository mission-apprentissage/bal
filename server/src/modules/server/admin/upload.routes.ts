import { MultipartFile } from "@fastify/multipart";
import { ObjectId } from "mongodb";
import { SResError } from "shared/routes/common.routes";
import {
  IResGetDocuments,
  IResPostAdminUpload,
  SReqQueryPostAdminUpload,
  SResGetDocuments,
  SResPostAdminUpload,
} from "shared/routes/upload.routes";

import { FILE_SIZE_LIMIT } from "../../../../../shared/constants/index";
import { processDocument } from "../../../common/apis/processor";
import {
  createEmptyDocument,
  deleteDocumentById,
  findDocuments,
  uploadFile,
} from "../../actions/documents.actions";
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

      const data = await request.file({
        limits: {
          fileSize: FILE_SIZE_LIMIT,
        },
      });

      if (!request.user || !data || !validateFile(data)) {
        return response.status(401).send({
          type: "invalid_file",
          message: "Le fichier n'est pas au bon format",
        });
      }

      try {
        const document = await createEmptyDocument({
          type_document,
          fileSize,
          filename: data.filename,
        });

        if (!document) {
          throw new Error("Impossible de stocker de le fichier");
        }

        const added_by = request.user._id.toString();

        await uploadFile(added_by, data.file, document._id, {
          mimetype: data.mimetype,
        });

        await processDocument(document._id.toString());

        return response
          .status(200)
          .send(document as unknown as IResPostAdminUpload);
      } catch (error) {
        const { message } = error as Error;
        return response.status(401).send({
          type: "invalid_file",
          message,
        });
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
      try {
        const documents = (await findDocuments(
          { import_progress: { $exists: true } },
          { projection: { hash_secret: 0, hash_fichier: 0 } }
        )) as IResGetDocuments;

        return response.status(200).send(documents as any); // TODO
      } catch (error) {
        response.log.error(error);
        throw new Error("Someting went wrong");
      }
    }
  );

  server.delete(
    "/admin/document/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      } as const,
      preHandler: [
        server.auth([server.validateSession]),
        ensureUserIsAdmin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ] as any,
    },
    async (request, response) => {
      try {
        await deleteDocumentById(new ObjectId(request.params.id));

        return response.status(200).send({ success: true });
      } catch (error) {
        response.log.error(error);
      }
    }
  );
};
