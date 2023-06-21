import {
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  ObjectId,
  UpdateFilter,
} from "mongodb";
import { oleoduc, writeData } from "oleoduc";
// @ts-ignore
import { IDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";
import { Readable } from "stream";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";
import config from "@/config";
import { clamav } from "@/services";

import {
  deleteFromStorage,
  getFromStorage,
  uploadToStorage,
} from "../../common/utils/ovhUtils";
import { parseCsv } from "../../common/utils/parserUtils";
import { noop } from "../server/utils/upload.utils";
import { parseContentLine } from "./deca.actions";
import {
  createDocumentContent,
  deleteDocumentContent,
} from "./documentContent.actions";

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

export const findDocuments = async (
  filter: Filter<IDocument>,
  options?: FindOptions<IDocument>
) => {
  const documents = await getDbCollection("documents")
    .find<IDocument>(filter, options)
    .toArray();

  return documents;
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
  type_document?: string;
  fileSize?: number;
  filename?: string;
  mimetype?: string;
  createDocumentDb?: boolean;
}

export const createEmptyDocument = async (options: IUploadDocumentOptions) => {
  const documentId = new ObjectId();
  const documentHash = crypto.generateKey();
  const path = `uploads/${documentId}/${options.filename}`;

  if (!options.filename) {
    throw new Error("Missing filename");
  }

  const doucument = await createDocument({
    _id: documentId,
    type_document: options.type_document,
    ext_fichier: options.filename.split(".").pop(),
    nom_fichier: options.filename,
    chemin_fichier: path,
    taille_fichier: options.fileSize || 0,
    import_progress: 0,
    hash_secret: documentHash,
    hash_fichier: "",
    confirm: true,
    added_by: new ObjectId().toString(),
    updated_at: new Date(),
    created_at: new Date(),
  });
  return doucument as IDocument;
};

export const uploadFile = async (
  added_by: string,
  stream: Readable,
  documentId: ObjectId = new ObjectId(),
  options: IUploadDocumentOptions
) => {
  const doc = await findDocument({ _id: documentId });
  if (!doc) {
    throw new Error("Impossible de trouver le document");
  }
  const documentHash = doc.hash_secret || crypto.generateKey();
  const path = doc.chemin_fichier;

  const { scanStream, getScanResults } = await clamav.getScanner();
  const { hashStream, getHash } = crypto.checksum();

  if (!options.mimetype) {
    throw new Error("Missing mimetype");
  }

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
    if (!testMode) {
      const listViruses = viruses.join(",");
      logger.error(
        `Uploaded file ${path} is infected by ${listViruses}. Deleting file from storage...`
      );

      await deleteFromStorage(path);
    }
    throw new Error("Le contenu du fichier est invalide");
  }

  if (options.createDocumentDb) {
    if (!options.filename) {
      throw new Error("Missing filename");
    }
    await createDocument({
      _id: documentId,
      type_document: options.type_document,
      ext_fichier: options.filename.split(".").pop(),
      nom_fichier: options.filename,
      chemin_fichier: path,
      import_progress: 0,
      taille_fichier: options.fileSize,
      hash_secret: documentHash,
      hash_fichier,
      confirm: true,
      added_by,
      updated_at: new Date(),
      created_at: new Date(),
    });
  }

  return documentId;
};

export const extractDocumentContent = async ({
  document,
  delimiter = ";",
  formatter = (line) => line,
}: {
  document: IDocument;
  delimiter?: string;
  formatter?: (line: any) => any;
}) => {
  const stream = await getFromStorage(document.chemin_fichier);

  logger.info("conversion csv to json started");
  await updateDocument(
    { _id: document._id },
    {
      $set: {
        lines_count: 0,
        import_progress: 0,
      },
    }
  );

  let importedLines = 0;
  let importedLength = 0;
  let currentPercent = 0;
  await oleoduc(
    stream,
    crypto.isCipherAvailable() ? crypto.decipher(document.hash_secret) : noop(),
    parseCsv({
      delimiter,
    }),
    writeData(async (json) => {
      importedLength += Buffer.byteLength(JSON.stringify(json));
      importedLines += 1;
      currentPercent = await updateImportProgress(
        document._id,
        importedLines,
        importedLength,
        document.taille_fichier,
        currentPercent
      );
      await importDocumentContent(document, [json], formatter);
    })
  );
  await updateDocument(
    { _id: document._id },
    {
      $set: {
        import_progress: 100,
      },
    }
  );
  logger.info("conversion csv to json ended");
};

export const updateImportProgress = async (
  _id: ObjectId,
  importedLines: number,
  importedLength: number,
  totalLength: number,
  currentPercent: number
) => {
  const step_precent = 2; // every 2%
  const newCurrentPercent = (importedLength * 100) / totalLength;
  if (newCurrentPercent - currentPercent < step_precent) {
    // Do not update
    return currentPercent;
  }
  await updateDocument(
    { _id },
    {
      $set: {
        lines_count: importedLines,
        import_progress: newCurrentPercent,
      },
    }
  );
  return newCurrentPercent;
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

  for (const [_lineNumber, line] of content.entries()) {
    const contentLine = formatter(line);

    if (!contentLine) {
      continue;
    }

    const documentContent = await createDocumentContent({
      content: contentLine,
      document_id: document._id.toString(),
      type_document: document.type_document,
      updated_at: new Date(),
      created_at: new Date(),
    });

    if (!documentContent) continue;

    documentContents = [...documentContents, documentContent];
  }

  // Create or update person

  return documentContents;
};

export const deleteDocumentById = async (documentId: ObjectId) => {
  const document = await findDocument({ _id: documentId });
  if (!document) {
    throw new Error("Impossible de trouver le document");
  }
  await deleteFromStorage(document.chemin_fichier);
  await deleteDocumentContent({
    document_id: document._id.toString(),
  });
  await getDbCollection("documents").deleteOne({ _id: document._id });
};

export const handleDocumentFileContent = async ({ document_id }) => {
  const document = await findDocument({
    _id: document_id,
  });
  if (!document) {
    throw new Error("Processor > /document: Can't find document");
  }
  switch (document.type_document) {
    case DOCUMENT_TYPES.DECA:
      await extractDocumentContent({
        document,
        delimiter: "|",
        formatter: parseContentLine,
      });
      break;
    case DOCUMENT_TYPES.VOEUX_PARCOURSUP_MAI_2023:
    case DOCUMENT_TYPES.VOEUX_AFFELNET_MAI_2023:
    case DOCUMENT_TYPES.VOEUX_AFFELNET_JUIN_2023:
      await extractDocumentContent({ document });
      break;

    default:
      break;
  }
};
