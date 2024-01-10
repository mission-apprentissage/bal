import { PassThrough } from "node:stream";

import { ObjectId } from "mongodb";
import { oleoduc } from "oleoduc";

import parentLogger from "@/common/logger";

import { initFtpConnection } from "../../../common/utils/ftpUtils";
import { uploadToStorage } from "../../../common/utils/ovhUtils";
import { DEFAULT_DELIMITER } from "../../../common/utils/parserUtils";
import config from "../../../config";
import { createUploadDocument } from "../../actions/documents.actions";
const logger = parentLogger.child({ module: "job:validation:hydrate_from_constructys" });

export const run_hydrate_from_constructys = async () => {
  logger.info("Constructys data import starting...");

  logger.info("Get remote file...");

  const document = await createUploadDocument({
    type_document: "constructys",
    fileSize: 0,
    filename: "constructys-data.csv",
    delimiter: DEFAULT_DELIMITER,
    added_by: new ObjectId(),
  });

  const myTransform = new PassThrough();

  const remoteFileName = "CTYS_MATCHA.csv";

  const client = await initFtpConnection(myTransform, config.ftp.constructys);

  client.downloadFile(remoteFileName, myTransform);

  await oleoduc(
    myTransform,
    // transformData(processCsvFile),
    await uploadToStorage(document.chemin_fichier, {
      contentType: "text/csv",
    })
  );

  // logger.info("Importing file...");
  // const opco_label = "Constructys"; // source
  // const result = await importer(destination, opco_label, 10); // parallelism = 10
  // return result;
};
