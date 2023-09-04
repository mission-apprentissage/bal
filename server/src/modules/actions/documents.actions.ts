import { captureException } from "@sentry/node";
import { Options } from "csv-parse";
import { Filter, FindOneAndUpdateOptions, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { oleoduc, writeData } from "oleoduc";
import { DOCUMENT_TYPES } from "shared/constants/documents";
import { IDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import { Readable } from "stream";
import { JsonObject } from "type-fest";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";
import config from "@/config";
import { clamav } from "@/services";

import { deleteFromStorage, getFromStorage, uploadToStorage } from "../../common/utils/ovhUtils";
import { parseCsv } from "../../common/utils/parserUtils";
import { noop } from "../server/utils/upload.utils";
import {
  IConstructysParsedContentLine,
  importConstructysContent,
  parseConstructysContentLine,
} from "./constructys.actions";
import { DECAParsedContentLine, importDecaContent, parseContentLine } from "./deca.actions";
import { createDocumentContent, deleteDocumentContent } from "./documentContent.actions";
import { MAILING_LIST_DOCUMENT_PREFIX } from "./mailingLists.actions";
import { importOcapiatContent, IOcapiatParsedContentLine } from "./ocapiat.actions";

const testMode = config.env === "test";

interface ICreate extends Omit<IDocument, "_id"> {
  _id: ObjectId;
}

export const createDocument = async (data: ICreate): Promise<IDocument> => {
  const now = new Date();
  const doc = {
    ...data,
    updated_at: now,
    created_at: now,
  };
  const { insertedId } = await getDbCollection("documents").insertOne(doc);

  return {
    ...doc,
    _id: insertedId,
  };
};

export const findDocument = async (
  filter: Filter<IDocument>,
  options?: FindOptions<IDocument>
): Promise<IDocument | null> => {
  return await getDbCollection("documents").findOne(filter, options);
};

export const findDocuments = async (filter: Filter<IDocument>, options?: FindOptions<IDocument>) => {
  const documents = await getDbCollection("documents").find<IDocument>(filter, options).toArray();

  return documents;
};

export const updateDocument = async (
  filter: Filter<IDocument>,
  update: UpdateFilter<IDocument>,
  options?: FindOneAndUpdateOptions
) => {
  const updated = await getDbCollection("documents").findOneAndUpdate(filter, update, {
    ...options,
    returnDocument: "after",
  });
  return updated.value;
};

export const getDocumentTypes = async (): Promise<string[]> => {
  // exclude mailing list documents
  const regexPattern = `^${MAILING_LIST_DOCUMENT_PREFIX}`;

  return getDbCollection("documents").distinct("type_document", {
    type_document: {
      $not: {
        $regex: new RegExp(regexPattern, "i"),
      },
    },
  });
};

export const readDocumentContent = async (
  document: IDocument,
  options: Options = {},
  callback: (line: JsonObject) => void
) => {
  const stream = await getFromStorage(document.chemin_fichier);

  await oleoduc(
    stream,
    crypto.isCipherAvailable() ? crypto.decipher(document.hash_secret) : noop(),
    parseCsv(options),
    writeData(callback)
  );
};

export const saveDocumentsColumns = async () => {
  const documents = await findDocuments({});

  await Promise.all(documents.map((document) => saveDocumentColumns(document)));
};

export const saveDocumentColumns = async (document: IDocument) => {
  let columns: string[] = [];
  try {
    await readDocumentContent(
      document,
      {
        // get only 1 record to get the columns
        to: 1,
        on_record: (record: unknown) => record,
      },
      async (json: JsonObject) => {
        columns = Object.keys(json)
          .sort()
          .filter((key) => key !== "");

        await updateDocument(
          { _id: document._id },
          {
            $set: {
              columns,
            },
          }
        );
      }
    );

    return columns;
  } catch (error) {
    logger.error(`Error while saving document columns for document ${document._id.toString()}`);
    return [];
  }
};

export const getDocumentColumns = async (type: string): Promise<string[]> => {
  const document = await findDocument({ type_document: type });

  if (!document) {
    return [];
  }

  if (document.columns) {
    return document.columns;
  }

  let columns = await saveDocumentColumns(document);

  if (columns.length) {
    return columns;
  }

  // get all keys from document content
  const aggregationPipeline = [
    { $match: { document_id: document._id.toString() } },
    { $project: { keys: { $objectToArray: "$content" } } },
    { $unwind: "$keys" },
    { $sort: { "keys.k": 1 } }, // Sort keys alphabetically
    {
      $group: {
        _id: null,
        uniqueKeys: { $addToSet: "$keys.k" },
      },
    },
    { $unwind: "$uniqueKeys" },
    { $sort: { uniqueKeys: 1 } }, // Sort unique keys alphabetically
  ];

  const result = await getDbCollection("documentContents").aggregate(aggregationPipeline).toArray();

  columns = result
    .map((item) => item.uniqueKeys)
    .sort()
    .filter((key) => key !== "");

  await updateDocument(
    { _id: document._id },
    {
      $set: {
        columns: columns,
      },
    }
  );

  return columns;
};

export const getDocumentSample = async (type: string): Promise<IDocumentContent[]> => {
  return await getDbCollection("documentContents").find({ type_document: type }).limit(10).toArray();
};

interface ICreateEmptyDocumentOptions {
  type_document: string;
  fileSize?: number;
  filename: `${string}.${IDocument["ext_fichier"]}`;
  mimetype?: string;
  createDocumentDb?: boolean;
}

export const createEmptyDocument = async (options: ICreateEmptyDocumentOptions) => {
  const documentId = new ObjectId();
  const documentHash = crypto.generateKey();
  const path = `uploads/${documentId}/${options.filename}`;

  if (!options.filename) {
    throw new Error("Missing filename");
  }

  const extFichier = options.filename.split(".").at(-1) as IDocument["ext_fichier"];

  const document = await createDocument({
    _id: documentId,
    type_document: options.type_document,
    ext_fichier: extFichier,
    nom_fichier: options.filename,
    chemin_fichier: path,
    taille_fichier: options.fileSize || 0,
    import_progress: 0,
    hash_secret: documentHash,
    hash_fichier: "",
    added_by: new ObjectId().toString(),
    updated_at: new Date(),
    created_at: new Date(),
  });
  return document;
};

interface IUploadDocumentOptionsWithCreate {
  type_document: string;
  fileSize: number;
  filename: `${string}.${IDocument["ext_fichier"]}`;
  mimetype: string;
  createDocumentDb: true;
}

interface IUploadDocumentOptionsWithoutCreate {
  mimetype: string;
  createDocumentDb?: false | void;
}

export const uploadFile = async (
  added_by: string,
  stream: Readable,
  documentId: ObjectId = new ObjectId(),
  options: IUploadDocumentOptionsWithCreate | IUploadDocumentOptionsWithoutCreate
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
      logger.error(`Uploaded file ${path} is infected by ${listViruses}. Deleting file from storage...`);

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
      ext_fichier: options.filename.split(".").pop() as IDocument["ext_fichier"],
      nom_fichier: options.filename,
      chemin_fichier: path,
      import_progress: 0,
      taille_fichier: options.fileSize,
      hash_secret: documentHash,
      hash_fichier,
      added_by,
      updated_at: new Date(),
      created_at: new Date(),
    });
  }

  await saveDocumentColumns(doc);

  return documentId;
};

export const extractDocumentContent = async ({
  document,
  delimiter = ";",
  formatter = (line) => line,
}: {
  document: IDocument;
  delimiter?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formatter?: (line: any) => any;
}) => {
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

  await readDocumentContent(
    document,
    {
      delimiter,
    },
    async (json: JsonObject) => {
      importedLength += Buffer.byteLength(JSON.stringify(Object.values(json)).replace(/^\[(.*)\]$/, "$1"));
      importedLines += 1;
      currentPercent = await updateImportProgress(
        document._id,
        importedLines,
        importedLength,
        document.taille_fichier,
        currentPercent
      );
      await importDocumentContent(document, [json], formatter);
    }
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
  let newCurrentPercent = (importedLength * 100) / totalLength;
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
  newCurrentPercent = newCurrentPercent > 100 ? 99 : newCurrentPercent;
  return newCurrentPercent;
};

export const importDocumentContent = async <TFileLine = unknown, TContentLine = unknown>(
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

    if (document.type_document === DOCUMENT_TYPES.DECA) {
      const decaContent = contentLine as unknown as DECAParsedContentLine;
      await importDecaContent(decaContent.emails, decaContent.siret);
    }

    if (document.type_document === DOCUMENT_TYPES.OCAPIAT) {
      await importOcapiatContent(contentLine as unknown as IOcapiatParsedContentLine);
      return [];
    }

    if (document.type_document === DOCUMENT_TYPES.CONSTRUCTYS) {
      await importConstructysContent(contentLine as unknown as IConstructysParsedContentLine);
      return [];
    }

    const documentContent = await createDocumentContent({
      content: contentLine,
      document_id: document._id.toString(),
      type_document: document.type_document,
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
  try {
    await deleteFromStorage(document.chemin_fichier);
  } catch (error) {
    captureException(error);
    logger.error(error);
  }
  try {
    await deleteDocumentContent({
      document_id: document._id.toString(),
    });
  } catch (error) {
    captureException(error);
    logger.error(error);
  }
  await getDbCollection("documents").deleteOne({ _id: document._id });
};

export const handleDocumentFileContent = async ({ document_id }: Record<"document_id", ObjectId>) => {
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
    case DOCUMENT_TYPES.CONSTRUCTYS:
      await extractDocumentContent({
        document,
        formatter: parseConstructysContentLine,
      });
      break;

    default:
      await extractDocumentContent({ document });
      break;
  }
};
