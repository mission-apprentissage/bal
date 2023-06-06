import {
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  ObjectId,
  UpdateFilter,
} from "mongodb";
import { accumulateData, oleoduc, writeData } from "oleoduc";
// @ts-ignore
import { IDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import { IUser } from "shared/models/user.model";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";
import { Readable } from "stream";

import { config } from "../../../config/config";
import { clamav } from "../../services";
import * as crypto from "../../utils/cryptoUtils";
import logger from "../../utils/logger";
import { getDbCollection } from "../../utils/mongodb";
import {
  deleteFromStorage,
  getFromStorage,
  uploadToStorage,
} from "../../utils/ovhUtils";
import { getJsonFromCsvData } from "../../utils/parserUtils";
import { noop } from "../server/utils/upload.utils";
import { handleDecaFileContent } from "./deca.actions";
import { createDocumentContent } from "./documentContent.actions";
import { handleVoeuxParcoursupFileContent } from "./mailingLists.actions";

const testMode = config.env === "test";

interface ICreateDocument extends Omit<IDocument, "_id"> {
  _id: ObjectId;
}

export const createDocument = async (data: ICreateDocument) => {
  const { insertedId: _id } = await getDbCollection("documents").insertOne(
    data
  );

  return findDocument({ _id });
};

export const findDocument = async (
  filter: Filter<IDocument>,
  options?: FindOptions<IDocument>
) => {
  return await getDbCollection("documents").findOne<IDocument>(filter, options);
};

export const updateDocument = async (
  filter: Filter<IDocument>,
  update: UpdateFilter<IDocument>,
  options?: FindOneAndUpdateOptions
) => {
  const updated = await getDbCollection("documents").findOneAndUpdate(
    filter,
    update,
    {
      ...options,
      returnDocument: "after",
    }
  );
  return updated.value as IDocument | null;
};
interface IUploadDocumentOptions {
  type_document: string;
  fileSize: number;
  filename: string;
  mimetype: string;
}

export const uploadDocument = async (
  user: IUser,
  stream: Readable,
  options: IUploadDocumentOptions
) => {
  const documentId = new ObjectId();
  const documentHash = crypto.generateKey();
  const path = `uploads/${documentId}/${options.filename}`;

  const { scanStream, getScanResults } = await clamav.getScanner();
  const { hashStream, getHash } = crypto.checksum();

  await oleoduc(
    stream,
    scanStream,
    hashStream,
    crypto.isCipherAvailable() ? crypto.cipher(documentHash) : noop(), // ISSUE
    testMode
      ? noop()
      : await uploadToStorage(path, {
          contentType: options.mimetype,
        })
  );

  const hash_fichier = await getHash();
  const { isInfected, viruses } = await getScanResults();

  if (isInfected) {
    if (!test) {
      const listViruses = viruses.join(",");
      logger.error(
        `Uploaded file ${path} is infected by ${listViruses}. Deleting file from storage...`
      );

      await deleteFromStorage(path);
    }
    throw new Error("Le contenu du fichier est invalide");
  }

  const document = await createDocument({
    _id: documentId,
    type_document: options.type_document,
    ext_fichier: options.filename.split(".").pop(),
    nom_fichier: options.filename,
    chemin_fichier: path,
    taille_fichier: options.fileSize,
    hash_secret: documentHash,
    hash_fichier,
    confirm: true,
    added_by: user._id.toString(),
    updated_at: new Date(),
    created_at: new Date(),
  });

  return document;
};

export const extractDocumentContent = async (
  document: IDocument,
  delimiter = ","
) => {
  const stream = await getFromStorage(document.chemin_fichier);

  let content: unknown[] = [];

  await oleoduc(
    stream,
    crypto.isCipherAvailable() ? crypto.decipher(document.hash_secret) : noop(),
    accumulateData(
      (acc: Uint8Array, value: ArrayBuffer) => {
        return Buffer.concat([acc, Buffer.from(value)]);
      },
      { accumulator: Buffer.from(new Uint8Array()) }
    ),
    writeData(async (data: Buffer) => {
      if (document.ext_fichier === "csv") {
        content = getJsonFromCsvData(data.toString(), delimiter);
      }
    })
  );

  return content;
};

export const updateImportProgress = async (
  _id: string,
  currentLine: number,
  totalLines: number,
  currentProgress: number
) => {
  const step_precent = 2; // every 2%
  const currentPercent = (currentLine * 100) / totalLines;
  if (currentPercent - currentProgress < step_precent) {
    // Do not update
    return currentProgress;
  }
  currentProgress = currentPercent;
  await updateDocument(
    { _id },
    {
      $set: {
        import_progress: currentProgress,
      },
    }
  );
  return currentPercent;
};

export const importDocumentContent = async <
  TFileLine = unknown,
  TContentLine = unknown
>(
  document: IDocument,
  content: TFileLine[],
  formatter: (line: TFileLine) => TContentLine
) => {
  let documentContents: IDocumentContent[] = [];

  await updateDocument(
    { _id: document._id },
    {
      $set: {
        lines_count: content.length,
        import_progress: 0,
      },
    }
  );

  let currentProgress = 0;
  for (const [lineNumber, line] of content.entries()) {
    const contentLine = formatter(line);

    currentProgress = await updateImportProgress(
      document._id,
      lineNumber,
      content.length,
      currentProgress
    );

    if (!contentLine) {
      continue;
    }

    const documentContent = await createDocumentContent({
      content: contentLine,
      document_id: document._id.toString(),
      updated_at: new Date(),
      created_at: new Date(),
    });

    if (!documentContent) continue;

    documentContents = [...documentContents, documentContent];
  }

  await updateDocument(
    { _id: document._id },
    {
      $set: {
        import_progress: 100,
      },
    }
  );

  // Create or update person

  return documentContents;
};

export const handleDocumentFileContent = async (document: IDocument) => {
  switch (document.type_document) {
    case DOCUMENT_TYPES.DECA:
      await handleDecaFileContent(document);
      break;
    case DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023:
    case DOCUMENT_TYPES.VOEUX_AFFELNET_MAI_2023:
      await handleVoeuxParcoursupFileContent(document);
      break;

    default:
      break;
  }
};
