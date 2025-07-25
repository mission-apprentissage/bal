import { IncomingMessage } from "node:http";

import { MultipartFile } from "@fastify/multipart";
import Boom from "@hapi/boom";
import { addJob, scheduleJob } from "job-processor";
import { ObjectId } from "mongodb";
import { oleoduc } from "oleoduc";
import { zRoutes } from "shared";
import { FILE_SIZE_LIMIT } from "shared/constants/index";
import { IDocument, IUploadDocument, toPublicDocument } from "shared/models/document.model";
import { Readable } from "stream";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";

import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { getFromStorage } from "../../../common/utils/ovhUtils";
import { getUserFromRequest } from "../../../security/authenticationService";
import {
  createUploadDocument,
  deleteDocumentById,
  findDocument,
  findDocuments,
  getDocumentTypes,
  updateDocument,
  uploadFile,
} from "../../actions/documents.actions";
import { findMailingListWithDocument } from "../../actions/mailingLists.actions";
import { Server } from "../server";
import { noop } from "../utils/upload.utils";

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

      try {
        await uploadFile(data.file, document, {
          mimetype: data.mimetype,
        });
      } catch (error) {
        // CSV files are deleted through the checkCsvFile function, to get the proper error message
        if (data.mimetype !== "text/csv") {
          await deleteDocumentById(document._id);
        }

        if (error.isBoom) {
          throw error;
        }

        const err = server.multipartErrors;
        logger.debug(err);
        throw Boom.badImplementation(error as Error);
      }

      const job = await scheduleJob({
        name: "import:document",
        payload: {
          document_id: document._id,
        },
      });

      await getDbCollection("documents").updateOne({ _id: document._id }, { $set: { job_id: job._id.toString() } });

      return response.status(200).send(toPublicDocument(document));
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

  server.put(
    "/admin/document/:id/resume",
    {
      schema: zRoutes.put["/admin/document/:id/resume"],
      onRequest: [server.auth(zRoutes.put["/admin/document/:id/resume"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const document = await getDbCollection("documents").findOne<IUploadDocument>({ _id: id });

      if (!document) {
        throw Boom.notFound("Document introuvable");
      }
      await updateDocument({ _id: id }, { $set: { job_status: "pending" } });

      await addJob({
        name: "import:document",
        payload: {
          document_id: document._id,
        },
        queued: true,
      });

      return response.status(200).send(toPublicDocument(document));
    }
  );

  server.get(
    "/admin/document/:id/download",
    {
      schema: zRoutes.get["/admin/document/:id/download"],
      onRequest: [server.auth(zRoutes.get["/admin/document/:id/download"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const document = await findDocument({
        _id: new ObjectId(id),
      });

      if (!document) {
        throw Boom.badData("Impossible de télécharger le fichier");
      }

      let stream: IncomingMessage | Readable;
      try {
        stream = await getFromStorage(document.chemin_fichier);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error.message.includes("Status code 404")) {
          throw Boom.notFound("Fichier introuvable");
        } else {
          throw Boom.badData("Impossible de télécharger le fichier");
        }
      }

      response.raw.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${document.nom_fichier}"`,
      });

      await oleoduc(
        // @ts-ignore
        stream,
        crypto.isCipherAvailable() ? crypto.decipher(document.hash_secret) : noop(),
        response.raw
      );
    }
  );
};
