import { IncomingMessage } from "node:http";

import Boom from "@hapi/boom";
import { ObjectId } from "mongodb";
import { oleoduc } from "oleoduc";
import { IUser } from "shared/models/user.model";
import {
  SReqGetMailingList,
  SResGetMailingLists,
} from "shared/routes/mailingList.routes";
import { Readable } from "stream";

import logger from "../../common/logger";
import * as crypto from "../../common/utils/cryptoUtils";
import { getFromStorage } from "../../common/utils/ovhUtils";
import {
  createMailingList,
  createMailingListFile,
  deleteMailingList,
  findMailingList,
  findMailingLists,
} from "../actions/mailingLists.actions";
import { addJob } from "../jobs/jobs";
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

      const mailingList = await createMailingList({
        source,
        status: "pending",
        updated_at: new Date(),
        created_at: new Date(),
        user_id: user._id.toString(),
      });

      if (!mailingList) {
        throw Boom.badData("Impossible de créer la liste de diffusion");
      }

      await addJob({
        name: "generate:mailing-list",
        payload: {
          mailing_list_id: mailingList._id,
        },
      });

      return response.status(200).send(mailingList);
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

      const mailingLists = await findMailingLists({
        user_id: user._id.toString(),
      });

      return response.status(200).send(mailingLists as any);
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
        !mailingList?.document ||
        user?._id.toString() !== mailingList?.user_id
      ) {
        throw Boom.forbidden("Forbidden");
      }

      let stream: IncomingMessage | Readable;
      let fileNotFound = false;
      try {
        stream = await getFromStorage(mailingList.document.chemin_fichier);
      } catch (error: any) {
        if (error.message.includes("Status code 404")) {
          fileNotFound = true;
        } else {
          throw Boom.badData(error.message);
        }
      }

      if (fileNotFound) {
        logger.info("file not found");
        await createMailingListFile(mailingList.document);
        stream = await getFromStorage(mailingList.document.chemin_fichier);
      }

      response.raw.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${mailingList.document.nom_fichier}"`,
      });

      await oleoduc(
        // @ts-ignore
        stream,
        crypto.isCipherAvailable()
          ? crypto.decipher(mailingList.document.hash_secret)
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
        !mailingList?.document ||
        user?._id.toString() !== mailingList?.user_id
      ) {
        throw Boom.forbidden("Forbidden");
      }

      await deleteMailingList(mailingList);

      return response.status(200).send({ success: true });
    }
  );
};
