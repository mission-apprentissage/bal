import { MultipartFile } from "@fastify/multipart";
import { ObjectId } from "mongodb";
// @ts-ignore
import { oleoduc } from "oleoduc";
import { IUser } from "shared/models/user.model";
import { SResError } from "shared/routes/common.routes";
import {
  SReqQueryPostAdminUpload,
  SResPostAdminUpload,
} from "shared/routes/upload.routes";
import { PassThrough } from "stream";

import { FILE_SIZE_LIMIT } from "../../../../../shared/constants/index";
import { clamav } from "../../../services";
import * as crypto from "../../../utils/cryptoUtils";
import logger from "../../../utils/logger";
import { deleteFromStorage, uploadToStorage } from "../../../utils/ovhUtils";
import { createDocument } from "../../actions/documents.actions";
import { Server } from "..";

const testMode = process.env.MNA_BAL_ENV === "test";

function noop() {
  return new PassThrough();
}

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

// TODO to secure
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
      preHandler: server.auth([
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const data = await request.file({
        limits: {
          fileSize: FILE_SIZE_LIMIT,
        },
      });

      if (!data || !validateFile(data)) {
        return response.status(401).send({
          type: "invalid_file",
          message: "Le fichier n'est pas au bon format",
        });
      }

      const documentId = new ObjectId();
      const documentHash = crypto.generateKey();
      const path = `uploads/${documentId}/${data.filename}`;

      const { scanStream, getScanResults } = await clamav.getScanner();
      const { hashStream, getHash } = crypto.checksum();

      await oleoduc(
        data.file,
        scanStream,
        hashStream,
        crypto.isCipherAvailable() ? crypto.cipher(documentHash) : noop(), // ISSUE
        testMode
          ? noop()
          : await uploadToStorage(path, {
              contentType: data.mimetype,
            })
      );

      const hash_fichier = await getHash();
      const { isInfected, viruses } = await getScanResults();

      if (isInfected) {
        if (!test) {
          const listViruses = viruses.join(",");
          logger.error(
            `Uploaded file ${path} is infected by ${listViruses}. Deleting file from storage...`
          );

          await deleteFromStorage(path);
        }
        return response.status(401).send({
          type: "invalid_file",
          message: "Le contenu du fichier est invalide",
        });
      }

      const fileSize = parseInt(request.headers["content-length"] ?? "0");

      const { _id: userId } = request.user as IUser;
      try {
        const document = await createDocument({
          _id: documentId,
          type_document: request.query.type_document,
          ext_fichier: data.filename.split(".").pop(),
          nom_fichier: data.filename,
          chemin_fichier: path,
          taille_fichier: fileSize,
          hash_secret: documentHash,
          hash_fichier,
          confirm: true,
          added_by: userId.toString(),
          updated_at: new Date(),
          created_at: new Date(),
        });

        if (!document) {
          return response.status(401).send({
            type: "invalid_file",
            message: "Impossible de stocker de le fichier",
          });
        }

        // @ts-ignore TODO: fix
        return response.status(200).send(document);
      } catch (error) {
        console.log(error);
        console.log(JSON.stringify(error));
      }
    }
  );
};
