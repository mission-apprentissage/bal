import { MultipartFile } from "@fastify/multipart";
import { SResError } from "shared/routes/common.routes";
import {
  IResPostAdminUpload,
  SReqQueryPostAdminUpload,
  SResPostAdminUpload,
} from "shared/routes/upload.routes";

import { FILE_SIZE_LIMIT } from "../../../../../shared/constants/index";
import { uploadDocument } from "../../actions/documents.actions";
import { processDocument } from "../../apis/processor";
import { Server } from "..";
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
        server.auth([server.validateJWT, server.validateSession]),
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
        const document = await uploadDocument(request.user, data, {
          type_document,
          fileSize,
        });

        if (!document) {
          throw new Error("Impossible de stocker de le fichier");
        }

        await processDocument(document);

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
};
