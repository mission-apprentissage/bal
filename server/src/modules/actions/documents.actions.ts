import type { Readable } from "stream";
import Boom from "@hapi/boom";
import { oleoduc } from "oleoduc";
import { deleteFromStorage, uploadToStorage } from "../../common/utils/ovhUtils";
import { noop } from "../server/utils/upload.utils";
import logger from "@/common/logger";
import config from "@/config";
import { clamav } from "@/services";

const testMode = config.env === "test";

interface IUploadDocumentOptions {
  mimetype: string;
}

const _90daysInSecs = 90 * 24 * 3600;

export const uploadSupportFile = async (stream: Readable, chemin_fichier: string, options: IUploadDocumentOptions) => {
  const { scanStream, getScanResults } = await clamav.getScanner();

  if (!options.mimetype) {
    throw Boom.badRequest("Missing mimetype");
  }

  await oleoduc(
    stream,
    scanStream,
    testMode ? noop() : await uploadToStorage(chemin_fichier, "support", _90daysInSecs, options.mimetype)
  );

  const { isInfected, viruses } = await getScanResults();

  if (isInfected) {
    if (!testMode) {
      const listViruses = viruses.join(",");
      logger.error(`Uploaded file ${chemin_fichier} is infected by ${listViruses}. Deleting file from storage...`);

      await deleteFromStorage(chemin_fichier, "support");
    }
    throw Boom.badRequest("Le contenu du fichier est invalide");
  }
};
