import { ObjectId } from "mongodb";
import { zRoutes } from "shared";
import type { MultipartFile } from "@fastify/multipart";
import { FILE_SIZE_LIMIT } from "shared/constants";
import type { IMailingListSource } from "shared/models/mailingList.source.model";
import { captureException } from "@sentry/node";
import { badImplementation, badRequest, notFound } from "@hapi/boom";
import { getUserFromRequest } from "../../../security/authenticationService";
import type { Server } from "../server";
import logger from "../../../common/logger";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import {
  deleteMailingList,
  killMailingList,
  resetMailingList,
  scheduleGenerate,
  scheduleMailingListJob,
} from "../../jobs/mailing-list/mailing-list.processor";
import { updateMailingListConfiguration } from "../../jobs/mailing-list/generator/mailing-list-generator";
import { downloadMailingListFile } from "../../jobs/mailing-list/storage/mailing-list-storage";
import {
  createMailingList,
  updateMailingListParseSettings,
} from "../../jobs/mailing-list/importer/mailing-list.importer";

export const mailingListRoutesPrivate = ({ server }: { server: Server }) => {
  server.post(
    "/_private/mailing-list",
    {
      schema: zRoutes.post["/_private/mailing-list"],
      onRequest: [server.auth(zRoutes.post["/_private/mailing-list"])],
    },
    async (request, response) => {
      const user = getUserFromRequest(request, zRoutes.post["/_private/mailing-list"]);

      let data: MultipartFile | null | undefined = null;
      try {
        data = await request.file({
          limits: {
            fileSize: FILE_SIZE_LIMIT,
          },
        });
      } catch (error) {
        const err = server.multipartErrors;
        logger.error(err);
        captureException(error);
        throw badImplementation("Erreur lors du traitement du fichier");
      }

      if (!data) {
        throw badRequest("Le fichier est requis");
      }

      const mailingList = await createMailingList(
        {
          name: request.query.name,
          delimiter: request.query.delimiter,
          expiresInDays: request.query.expiresInDays,
          file: data,
        },
        user
      );

      return response.status(201).send({
        _id: mailingList._id,
      });
    }
  );

  server.get(
    "/_private/mailing-list",
    {
      schema: zRoutes.get["/_private/mailing-list"],
      onRequest: [server.auth(zRoutes.get["/_private/mailing-list"])],
    },
    async (request, response) => {
      const { page, size, sort, sortOrder } = request.query;

      const sortValue = sortOrder === "asc" ? 1 : -1;

      const [total, items] = await Promise.all([
        getDbCollection("mailingListsV2").countDocuments(),
        getDbCollection("mailingListsV2")
          .find(
            {},
            {
              sort: { [sort]: sortValue, created_at: sortValue },
              skip: page * size,
              limit: size,
            }
          )
          .toArray(),
      ]);

      return response.status(200).send({
        items,
        total,
        page,
        size,
      });
    }
  );

  server.get(
    "/_private/mailing-list/:id",
    {
      schema: zRoutes.get["/_private/mailing-list/:id"],
      onRequest: [server.auth(zRoutes.get["/_private/mailing-list/:id"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const mailingList = await getDbCollection("mailingListsV2").findOne({
        _id: id,
      });

      return response.status(200).send(mailingList);
    }
  );

  server.post(
    "/_private/mailing-list/:id/schedule",
    {
      schema: zRoutes.post["/_private/mailing-list/:id/schedule"],
      onRequest: [server.auth(zRoutes.post["/_private/mailing-list/:id/schedule"])],
    },
    async (request, response) => {
      const { id } = request.params;
      const { status } = request.body;

      const success = await scheduleMailingListJob(new ObjectId(id), status);

      return response.status(200).send({ success });
    }
  );

  server.post(
    "/_private/mailing-list/:id/reset",
    {
      schema: zRoutes.post["/_private/mailing-list/:id/reset"],
      onRequest: [server.auth(zRoutes.post["/_private/mailing-list/:id/reset"])],
    },
    async (request, response) => {
      const { id } = request.params;
      const { status } = request.body;

      await resetMailingList(id, status);

      return response.status(200).send({ success: true });
    }
  );

  server.get(
    "/_private/mailing-list/:id/source/sample",
    {
      schema: zRoutes.get["/_private/mailing-list/:id/source/sample"],
      onRequest: [server.auth(zRoutes.get["/_private/mailing-list/:id/source/sample"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const data = await getDbCollection("mailingList.source")
        .aggregate<IMailingListSource>([{ $match: { mailing_list_id: id } }, { $sample: { size: 10 } }])
        .toArray();

      return response.status(200).send(data.map((d) => d.data));
    }
  );

  server.put(
    "/_private/mailing-list/:id/config",
    {
      schema: zRoutes.put["/_private/mailing-list/:id/config"],
      onRequest: [server.auth(zRoutes.put["/_private/mailing-list/:id/config"])],
    },
    async (request, response) => {
      const { id } = request.params;

      await updateMailingListConfiguration(id, request.body);

      return response.status(200).send({ success: true });
    }
  );

  server.put(
    "/_private/mailing-list/:id/source",
    {
      schema: zRoutes.put["/_private/mailing-list/:id/source"],
      onRequest: [server.auth(zRoutes.put["/_private/mailing-list/:id/source"])],
    },
    async (request, response) => {
      const { id } = request.params;

      await updateMailingListParseSettings(id, request.body);

      return response.status(200).send({ success: true });
    }
  );

  server.post(
    "/_private/mailing-list/:id/generate",
    {
      schema: zRoutes.post["/_private/mailing-list/:id/generate"],
      onRequest: [server.auth(zRoutes.post["/_private/mailing-list/:id/generate"])],
    },
    async (request, response) => {
      const { id } = request.params;

      await scheduleGenerate(id);

      return response.status(200).send({ success: true });
    }
  );

  server.get(
    "/_private/mailing-list/:id/output/download",
    {
      schema: zRoutes.get["/_private/mailing-list/:id/output/download"],
      onRequest: [server.auth(zRoutes.get["/_private/mailing-list/:id/output/download"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const controller = new AbortController();
      request.raw.on("close", () => {
        if (request.raw.destroyed) {
          controller.abort();
        }
      });

      const { headers, stream } = await downloadMailingListFile(id, "result", controller.signal);

      return response.status(200).headers(headers).send(stream);
    }
  );

  server.get(
    "/_private/mailing-list/:id/source/download",
    {
      schema: zRoutes.get["/_private/mailing-list/:id/source/download"],
      onRequest: [server.auth(zRoutes.get["/_private/mailing-list/:id/source/download"])],
    },
    async (request, response) => {
      const { id } = request.params;

      const controller = new AbortController();
      request.raw.on("close", () => {
        if (request.raw.destroyed) {
          controller.abort();
        }
      });

      const { headers, stream } = await downloadMailingListFile(id, "source", controller.signal);

      return response.status(200).headers(headers).send(stream);
    }
  );

  server.put(
    "/_private/mailing-list/:id/name",
    {
      schema: zRoutes.put["/_private/mailing-list/:id/name"],
      onRequest: [server.auth(zRoutes.put["/_private/mailing-list/:id/name"])],
    },
    async (request, response) => {
      const { id } = request.params;
      const { name } = request.body;

      const mailingList = await getDbCollection("mailingListsV2").updateOne(
        {
          _id: id,
        },
        { $set: { name, updated_at: new Date() } }
      );

      if (mailingList.matchedCount === 0) {
        throw notFound("La liste de diffusion n'existe pas");
      }

      return response.status(200).send({ success: true });
    }
  );

  server.post(
    "/_private/mailing-list/:id/kill",
    {
      schema: zRoutes.post["/_private/mailing-list/:id/kill"],
      onRequest: [server.auth(zRoutes.post["/_private/mailing-list/:id/kill"])],
    },
    async (request, response) => {
      const { id } = request.params;

      await killMailingList(id);

      return response.status(200).send({ success: true });
    }
  );

  server.delete(
    "/_private/mailing-list/:id",
    {
      schema: zRoutes.delete["/_private/mailing-list/:id"],
      onRequest: [server.auth(zRoutes.delete["/_private/mailing-list/:id"])],
    },
    async (request, response) => {
      const { id } = request.params;

      await deleteMailingList(id);

      return response.status(200).send({ success: true });
    }
  );
};
