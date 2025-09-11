import type { IncomingMessage } from "node:http";

import type { Readable } from "stream";
import Boom, { notFound } from "@hapi/boom";
import { addJob } from "job-processor";
import { ObjectId } from "mongodb";
import { oleoduc } from "oleoduc";
import { zRoutes } from "shared";
import type { IMailingListDocument } from "shared/models/document.model";

import logger from "../../common/logger";
import * as crypto from "../../common/utils/cryptoUtils";
import { getFromStorage } from "../../common/utils/ovhUtils";
import { getUserFromRequest } from "../../security/authenticationService";
import { findDocument } from "../actions/documents.actions";
import {
  createMailingList,
  createMailingListFile,
  deleteMailingList,
  findMailingList,
  findMailingListWithDocument,
} from "../actions/mailingLists.actions";
import type { Server } from "./server";
import { noop } from "./utils/upload.utils";

export const mailingListRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/mailing-list",
    {
      schema: zRoutes.post["/mailing-list"],
      onRequest: [server.auth(zRoutes.post["/mailing-list"])],
    },
    async (request, response) => {
      const user = getUserFromRequest(request, zRoutes.post["/mailing-list"]);

      try {
        await createMailingList({
          added_by: user._id.toString(),
          ...request.body,
        });

        return response.status(200).send({ success: true });
      } catch (_error) {
        throw Boom.badData("Impossible de créer la liste de diffusion");
      }
    }
  );

  server.get(
    "/mailing-lists",
    {
      schema: zRoutes.get["/mailing-lists"],
      onRequest: [server.auth(zRoutes.get["/mailing-lists"])],
    },
    async (_request, response) => {
      const mailingLists = await findMailingListWithDocument({});

      return response.status(200).send(mailingLists);
    }
  );

  server.get(
    "/mailing-lists/:id",
    {
      schema: zRoutes.get["/mailing-lists/:id"],
      onRequest: [server.auth(zRoutes.get["/mailing-lists/:id"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (!mailingList) {
        throw notFound("Liste de diffusion introuvable");
      }

      return response.status(200).send(mailingList);
    }
  );

  server.get(
    "/mailing-lists/:id/progress",
    {
      schema: zRoutes.get["/mailing-lists/:id/progress"],
      onRequest: [server.auth(zRoutes.get["/mailing-lists/:id/progress"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (!mailingList) {
        throw Boom.notFound("Liste de diffusion introuvable");
      }

      const document = mailingList.document_id
        ? await findDocument<IMailingListDocument>({
            _id: new ObjectId(mailingList.document_id),
            kind: "mailingList",
          })
        : null;

      const status = document
        ? document.job_status
        : mailingList.created_at.getTime() + 2 * 3600 * 1000 < Date.now()
          ? "error"
          : "pending";

      return response.status(200).send({
        status,
        process_progress: document?.process_progress ?? 0,
        lines_count: document?.lines_count ?? 0,
      });
    }
  );

  server.get(
    "/mailing-lists/:id/download",
    {
      schema: zRoutes.get["/mailing-lists/:id/download"],
      onRequest: [server.auth(zRoutes.get["/mailing-lists/:id/download"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (!mailingList) {
        throw Boom.notFound("Liste de diffusion introuvable");
      }

      if (!mailingList.document_id) {
        throw Boom.conflict("Impossible de télécharger le fichier, aucun document associé");
      }

      const document = await findDocument({
        _id: new ObjectId(mailingList.document_id as string),
      });

      if (!document) {
        throw Boom.badData("Impossible de télécharger le fichier");
      }

      let stream: IncomingMessage | Readable;
      let fileNotFound = false;
      try {
        stream = await getFromStorage(document.chemin_fichier, "main");
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
        await createMailingListFile(mailingList, document);
        stream = await getFromStorage(document.chemin_fichier, "main");
      }

      const fileName = `liste-diffusion-${mailingList.campaign_name}-${mailingList.source}.csv`;

      response.raw.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      });

      await oleoduc(
        // @ts-ignore
        stream,
        crypto.isCipherAvailable() ? crypto.decipher(document.hash_secret) : noop(),
        response.raw
      );
    }
  );

  server.delete(
    "/mailing-list/:id",
    {
      schema: zRoutes.delete["/mailing-list/:id"],
      onRequest: [server.auth(zRoutes.delete["/mailing-list/:id"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (!mailingList) {
        throw Boom.notFound("Liste de diffusion introuvable");
      }

      await deleteMailingList(mailingList);

      return response.status(200).send({ success: true });
    }
  );

  server.put(
    "/mailing-list/:id/resume",
    {
      schema: zRoutes.put["/mailing-list/:id/resume"],
      onRequest: [server.auth(zRoutes.put["/mailing-list/:id/resume"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: id,
      });

      if (!mailingList) {
        throw Boom.notFound("Liste de diffusion introuvable");
      }

      await addJob({
        name: "generate:mailing-list",
        payload: {
          mailing_list_id: mailingList._id.toString(),
        },
        queued: true,
      });

      return response.status(200).send({ success: true });
    }
  );
};
