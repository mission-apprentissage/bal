import { IncomingMessage } from "node:http";

import Boom from "@hapi/boom";
import { ObjectId } from "mongodb";
import { oleoduc } from "oleoduc";
import { IUser } from "shared/models/user.model";
import {
  SReqGetMailingList,
  SResGetMailingList,
  SResGetMailingLists,
} from "shared/routes/mailingList.routes";
import { Readable } from "stream";

import logger from "../../common/logger";
import * as crypto from "../../common/utils/cryptoUtils";
import { getFromStorage } from "../../common/utils/ovhUtils";
import { findDocument } from "../actions/documents.actions";
import {
  createMailingList,
  createMailingListFile,
  deleteMailingList,
  findMailingList,
  findMailingLists,
} from "../actions/mailingLists.actions";
import { Server } from "./server";
import { noop } from "./utils/upload.utils";

export const mailingListRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/mailing-list",
    {
      schema: {
        body: SReqGetMailingList,
      } as const,
      preHandler: server.auth([
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const { source } = request.body;
      const user = request.user as IUser;

      try {
        await createMailingList({ user_id: user._id.toString(), source });

        return response.status(200).send();
      } catch (error) {
        throw Boom.badData("Impossible de créer la liste de diffusion");
      }
    }
  );

  server.get(
    "/mailing-lists",
    {
      schema: {
        response: {
          200: SResGetMailingLists,
        },
      } as const,
      preHandler: server.auth([
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const user = request.user as IUser;

      const mailingLists = await findMailingLists(
        {
          "payload.user_id": user._id.toString(),
        },
        {
          sort: { created_at: -1 },
        }
      );

      return response.status(200).send(mailingLists as any);
    }
  );

  server.get(
    "/mailing-lists/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
        response: {
          200: SResGetMailingList,
        },
      } as const,
      preHandler: server.auth([
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const { user } = request;
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (mailingList?.payload?.user_id !== user?._id.toString()) {
        throw Boom.forbidden("Forbidden");
      }

      return response.status(200).send(mailingList as any);
    }
  );

  server.get(
    "/mailing-lists/:id/download",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      } as const,
      preHandler: server.auth([
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const { user } = request;
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      /**
       * Téléchargement disponible uniquement pour l'utilisateur qui a demandé la création de la liste
       * et si celle-ci est générée
       */

      if (
        !mailingList?.payload?.document_id ||
        user?._id.toString() !== mailingList.payload?.user_id
      ) {
        throw Boom.forbidden("Forbidden");
      }

      const document = await findDocument({
        _id: new ObjectId(mailingList.payload.document_id as string),
      });

      if (!document) {
        throw Boom.badData("Impossible de télécharger le fichier");
      }

      let stream: IncomingMessage | Readable;
      let fileNotFound = false;
      try {
        stream = await getFromStorage(document.chemin_fichier);
      } catch (error: any) {
        if (error.message.includes("Status code 404")) {
          fileNotFound = true;
        } else {
          throw Boom.badData("Impossible de télécharger le fichier");
        }
      }

      if (fileNotFound) {
        logger.info("file not found");
        await createMailingListFile(document);
        stream = await getFromStorage(document.chemin_fichier);
      }

      response.raw.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${document.nom_fichier}"`,
      });

      await oleoduc(
        // @ts-ignore
        stream,
        crypto.isCipherAvailable()
          ? crypto.decipher(document.hash_secret)
          : noop(),
        response.raw
      );
    }
  );

  server.delete(
    "/mailing-list/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"],
        },
      } as const,
      preHandler: server.auth([
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      const { user } = request;
      const { id } = request.params;

      const mailingList = await findMailingList({
        _id: new ObjectId(id),
      });

      if (
        !mailingList ||
        user?._id.toString() !== mailingList?.payload?.user_id
      ) {
        throw Boom.forbidden("Forbidden");
      }

      await deleteMailingList(mailingList);

      return response.status(200).send({ success: true });
    }
  );
};
