import { MultipartFile } from "@fastify/multipart";
import Boom from "@hapi/boom";
import { zRoutes } from "shared";
import { FILE_SIZE_LIMIT } from "shared/constants/index";

import logger from "@/common/logger";

// import { createUploadDocument, uploadFile } from "../../actions/documents.actions";
import { uploadSupportFile } from "../actions/documents.actions";
import { Server } from "./server";

const validateFile = (file: MultipartFile) => {
  if (file.mimetype !== "text/csv") {
    return false;
  }

  if (!file.filename.endsWith(".csv")) {
    return false;
  }

  return true;
};

export const uploadSupportRoutes = ({ server }: { server: Server }) => {
  /**
   * Importer un fichier
   */
  server.post(
    "/support/upload",
    {
      schema: zRoutes.post["/support/upload"],
    },
    async (request, response) => {
      const { verified_key, email } = request.query;
      const fileSize = parseInt(request.headers["content-length"] ?? "0");

      if (fileSize === 0) {
        throw Boom.unauthorized("Le fichier n'est pas valide");
      }

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

      const chemin_fichier = `${verified_key}/${email}/${data.filename}`;
      try {
        await uploadSupportFile(data.file, chemin_fichier, {
          mimetype: data.mimetype,
        });

        return response.status(200).send({});
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
};
