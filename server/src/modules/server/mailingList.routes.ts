import { IncomingMessage } from "node:http";

import Boom, { notFound } from "@hapi/boom";
import { ObjectId } from "mongodb";
import { oleoduc } from "oleoduc";
import { zRoutes } from "shared";
import { Readable } from "stream";

import logger from "../../common/logger";
import * as crypto from "../../common/utils/cryptoUtils";
import { getFromStorage } from "../../common/utils/ovhUtils";
import { findDocument } from "../actions/documents.actions";
import { findJob } from "../actions/job.actions";
import {
  createMailingList,
  createMailingListFile,
  deleteMailingList,
  findMailingList,
  findMailingLists,
} from "../actions/mailingLists.actions";
import { Server } from "./server";
import { getUserFromRequest } from "./utils/auth.strategies";
import { noop } from "./utils/upload.utils";

export const mailingListRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/mailing-list",
    {
      schema: zRoutes.post["/mailing-list"],
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      const user = getUserFromRequest(request);

      try {
        await createMailingList({
          added_by: user._id.toString(),
          ...request.body,
        });

        return response.status(200).send({ success: true });
      } catch (error) {
        throw Boom.badData("Impossible de créer la liste de diffusion");
      }
    }
  );

  server.get(
    "/mailing-lists",
    {
      schema: zRoutes.get["/mailing-lists"],
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      const user = getUserFromRequest(request);

      const mailingLists = await findMailingLists(
        {
          added_by: user._id.toString(),
        },
        {
          sort: { created_at: -1 },
        }
      );

      return response.status(200).send(mailingLists);
    }
  );

  server.get(
    "/mailing-lists/:id",
    {
      schema: zRoutes.get["/mailing-lists/:id"],
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      const { user } = request;
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (!mailingList) {
        throw notFound();
      }

      if (mailingList?.added_by !== user?._id.toString()) {
        throw Boom.forbidden("Forbidden");
      }

      return response.status(200).send(mailingList);
    }
  );

  server.get(
    "/mailing-lists/:id/progress",
    {
      schema: zRoutes.get["/mailing-lists/:id/progress"],
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      const user = getUserFromRequest(request);
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
        added_by: user._id.toString(),
      });

      if (!mailingList) {
        throw Boom.forbidden("Forbidden");
      }

      const job = await findJob({
        "payload.mailing_list_id": mailingList._id.toString(),
      });

      if (!job) {
        throw Boom.notFound("Job not found");
      }

      const { processed, processed_count } = job.payload || {};

      return response.status(200).send({
        status: job.status,
        processed: (processed as number) ?? 0,
        processed_count: (processed_count as number) ?? 0,
      });
    }
  );

  server.get(
    "/mailing-lists/:id/download",
    {
      schema: zRoutes.get["/mailing-lists/:id/download"],
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      const user = getUserFromRequest(request);
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
        added_by: user._id.toString(),
      });

      /**
       * Téléchargement disponible uniquement pour l'utilisateur qui a demandé la création de la liste
       * et si celle-ci est générée
       */

      if (!mailingList?.document_id || user?._id.toString() !== mailingList?.added_by) {
        throw Boom.forbidden("Forbidden");
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
        stream = await getFromStorage(document.chemin_fichier);
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
        stream = await getFromStorage(document.chemin_fichier);
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
      preHandler: server.auth([server.validateSession]),
    },
    async (request, response) => {
      const user = getUserFromRequest(request);
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (!mailingList || user._id.toString() !== mailingList?.added_by) {
        throw Boom.forbidden("Forbidden");
      }

      await deleteMailingList(mailingList);

      return response.status(200).send({ success: true });
    }
  );
};
