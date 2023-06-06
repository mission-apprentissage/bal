import { ObjectId } from "mongodb";
import { oleoduc } from "oleoduc";
import { IUser } from "shared/models/user.model";
import {
  IResGetMailingLists,
  SReqGetMailingList,
  SResGetMailingLists,
} from "shared/routes/v1/mailingList.routes";

import * as crypto from "../../../utils/cryptoUtils";
import { getFromStorage } from "../../../utils/ovhUtils";
import {
  createMailingList,
  findMailingList,
  findMailingLists,
} from "../../actions/mailingLists.actions";
import { processMailingList } from "../../apis/processor";
import { Server } from "..";
import { noop } from "../utils/upload.utils";

export const mailingListRoutes = ({ server }: { server: Server }) => {
  server.post(
    "/mailing-list",
    {
      schema: {
        body: SReqGetMailingList,
      } as const,
      preHandler: server.auth([
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      try {
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
          throw new Error("Can't create mailing list");
        }

        await processMailingList(mailingList);

        return response.status(200).send(mailingList);
      } catch (error) {
        response.log.error(error);
        throw new Error("Someting went wrong");
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
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      try {
        const user = request.user as IUser;

        const mailingLists = await findMailingLists({
          user_id: user._id.toString(),
        });

        return response.status(200).send(mailingLists as IResGetMailingLists);
      } catch (error) {
        response.log.error(error);
        throw new Error("Someting went wrong");
      }
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
        server.validateJWT,
        server.validateSession,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any,
    },
    async (request, response) => {
      try {
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
          return response.status(403).send({ message: "Forbidden" });
        }

        const stream = await getFromStorage(
          mailingList.document.chemin_fichier
        );

        response.raw.writeHead(200, {
          "Content-Type": "application/octet-stream",
          "Content-Disposition": `attachment; filename="${mailingList.document.nom_fichier}"`,
        });

        await oleoduc(
          stream,
          crypto.isCipherAvailable()
            ? crypto.decipher(mailingList.document.hash_secret)
            : noop(),
          response.raw
        );
      } catch (error) {
        response.log.error(error);
        throw new Error("Someting went wrong");
      }
    }
  );
};
