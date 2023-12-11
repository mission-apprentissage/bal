import { IncomingMessage } from "node:http";

import { MultipartFile } from "@fastify/multipart";
import Boom from "@hapi/boom";
import { oleoduc, transformData, writeData } from "oleoduc";
import { zRoutes } from "shared";
import { FILE_SIZE_LIMIT } from "shared/constants/index";
import { Readable } from "stream";

import logger from "@/common/logger";

import { deleteFromStorage, getFromStorage } from "../../common/utils/ovhUtils";
// import { createUploadDocument, uploadFile } from "../../actions/documents.actions";
import { uploadSupportFile } from "../actions/documents.actions";
import { Server } from "./server";

const validateFile = (file: MultipartFile) => {
  if (
    file.mimetype !== "text/csv" &&
    file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
    file.mimetype !== "application/vnd.ms-excel"
  ) {
    return false;
  }

  if (!file.filename.endsWith(".csv") && !file.filename.endsWith(".xlsx") && !file.filename.endsWith(".xls")) {
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

  server.get(
    "/support/files-list",
    {
      schema: zRoutes.get["/support/files-list"],
      onRequest: [server.auth(zRoutes.get["/support/files-list"])],
    },
    async (request, response) => {
      const stream = await getFromStorage("/", {
        account: "mna",
        storage: "mna-support",
      });
      let result: { id: string }[] = [];
      await oleoduc(
        // @ts-ignore
        stream,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transformData((line: any) => JSON.parse(line)),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        writeData((resp: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          result = resp.map(({ name }: any) => ({ id: name }));
        })
      );
      return response.status(200).send(result);
    }
  );

  server.get(
    "/support/file/download",
    {
      schema: zRoutes.get["/support/file/download"],
      onRequest: [server.auth(zRoutes.get["/support/file/download"])],
    },
    async (request, response) => {
      const { id } = request.query;
      const [_key, _email, ...parts] = id.split("/");
      const remerge = parts.join("-");

      let stream: IncomingMessage | Readable;
      let fileNotFound = false;
      try {
        stream = await getFromStorage(id, {
          account: "mna",
          storage: "mna-support",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message.includes("Status code 404")) {
          fileNotFound = true;
        } else {
          throw Boom.badData("Impossible de télécharger le fichier");
        }
      }

      if (fileNotFound) {
        logger.info("file not found");
      }

      const fileName = remerge;

      response.raw.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      });

      await oleoduc(
        // @ts-ignore
        stream,
        response.raw
      );
    }
  );

  server.delete(
    "/support/file/delete",
    {
      schema: zRoutes.delete["/support/file/delete"],
      onRequest: [server.auth(zRoutes.delete["/support/file/delete"])],
    },
    async (request, response) => {
      const { id } = request.query;

      await deleteFromStorage(id, {
        account: "mna",
        storage: "mna-support",
      });

      return response.status(200).send({ success: true });
    }
  );
};
