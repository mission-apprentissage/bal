import { PassThrough } from "node:stream";

import { addJob } from "job-processor";
import { ObjectId } from "mongodb";
import { DOCUMENT_TYPES } from "shared/constants/documents";

import parentLogger from "@/common/logger";

import { initFtpConnection } from "../../../common/utils/ftpUtils";
import { DEFAULT_DELIMITER } from "../../../common/utils/parserUtils";
import config from "../../../config";
import { createUploadDocument, updateDocument, uploadFile } from "../../actions/documents.actions";
const logger = parentLogger.child({ module: "job:validation:hydrate_from_ocapiat" });

export const run_hydrate_from_ocapiat = async () => {
  logger.info("Ocapiat data import starting...");

  logger.info("Get remote file...");

  const document = await createUploadDocument({
    type_document: DOCUMENT_TYPES.OCAPIAT,
    fileSize: 0,
    filename: "ocapiat-data.csv",
    delimiter: DEFAULT_DELIMITER,
    added_by: new ObjectId(),
  });

  let fileSize = 0;
  const myTransform = new PassThrough({
    transform(chunk, _encoding, callback) {
      fileSize += chunk.length;
      callback(null, chunk);
    },
  });

  const remoteFileName = "ContactsEntreprisesOPSIcsv.csv";

  const client = await initFtpConnection(myTransform, config.ftp.ocapiat);

  client.downloadFile(remoteFileName, myTransform);

  await uploadFile("job:validation:hydrate_from_ocapiat", myTransform, document, {
    mimetype: "text/csv",
  });
  await updateDocument(
    { _id: document._id },
    {
      $set: {
        taille_fichier: fileSize,
      },
    }
  );

  await addJob({
    name: "import:document",
    payload: {
      document_id: document._id,
    },
    queued: true,
  });
};
