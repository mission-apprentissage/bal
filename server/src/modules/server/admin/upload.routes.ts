import { EventEmitter } from "events";
import { FastifyReply } from "fastify";
import { createWriteStream } from "fs";
import multiparty from "multiparty";
// @ts-ignore
import { oleoduc } from "oleoduc";
import { PassThrough } from "stream";

import { clamav } from "../../../services";
import * as crypto from "../../../utils/cryptoUtils";
import logger from "../../../utils/logger";
import { deleteFromStorage, uploadToStorage } from "../../../utils/ovhUtils";
import { Server } from "..";

function discard() {
  return createWriteStream("/dev/null");
}

function noop() {
  return new PassThrough();
}

// eslint-disable-next-line unused-imports/no-unused-vars
function handleMultipartForm(
  req: any,
  res: FastifyReply,
  callback: (part: any) => Promise<any>
) {
  const form = new multiparty.Form();
  const formEvents = new EventEmitter();
  // 'close' event is fired just after the form has been read but before file is scanned and uploaded to storage.
  // So instead of using form.on('close',...) we use a custom event to end response when everything is finished
  formEvents.on("terminated", async (e) => {
    if (e) {
      logger.error(e);
      return res.status(400).send({
        error:
          e.message === "Le fichier est trop volumineux"
            ? "Le fichier est trop volumineux"
            : "Le contenu du fichier est invalide",
      });
    }

    return res.status(200).send({
      // documents,
    });
  });

  form.on("error", () => {
    return res
      .status(400)
      .send({ error: "Le contenu du fichier est invalide" });
  });
  form.on("part", async (part) => {
    if (
      part.headers["content-type"] !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
      part.headers["content-type"] !== "application/vnd.ms-excel" &&
      part.headers["content-type"] !== "text/csv"
    ) {
      form.emit("error", new Error("Le fichier n'est pas au bon format"));
      return part.pipe(discard());
    }

    if (
      !part.filename.endsWith(".xlsx") &&
      !part.filename.endsWith(".xls") &&
      !part.filename.endsWith(".csv")
    ) {
      form.emit("error", new Error("Le fichier n'est pas au bon format"));
      return part.pipe(discard());
    }

    callback(part)
      .then(() => {
        // @ts-ignore
        if (!form.bytesExpected || form.bytesReceived === form.bytesExpected) {
          formEvents.emit("terminated");
        }
        part.resume();
      })
      .catch((e: any) => {
        formEvents.emit("terminated", e);
      });
  });

  form.parse(req);
}

// TODO to secure
export const uploadAdminRoutes = ({ server }: { server: Server }) => {
  /**
   * Importer un fichier
   */
  server.post("/admin/upload", {}, async (request, response) => {
    const data = await request.file({
      limits: {
        fileSize: 10485760,
      },
    });

    if (!data?.file) {
      throw new Error("Fichier invalide");
    }

    const test = false; // TODO TO PASS in query param
    const documentId = "6437ebc08dd1c5cc33501536"; // TODO
    const { filename } = data;
    const path = `uploads/${documentId}/${filename}`;

    const { scanStream, getScanResults } = await clamav.getScanner();
    const { hashStream, getHash } = crypto.checksum();

    await oleoduc(
      data.file,
      scanStream,
      hashStream,
      crypto.isCipherAvailable() ? crypto.cipher(documentId) : noop(), // ISSUE
      test
        ? noop()
        : await uploadToStorage(path, {
            contentType: data.mimetype,
          })
    );

    const hash_fichier = await getHash();
    const { isInfected, viruses } = await getScanResults();
    if (isInfected) {
      if (!test) {
        logger.error(
          `Uploaded file ${path} is infected by ${viruses.join(
            ","
          )}. Deleting file from storage...`
        );

        await deleteFromStorage(path);
      }
      throw new Error("Le contenu du fichier est invalide");
    }

    console.log(hash_fichier);

    return response.send({});
  });
};
