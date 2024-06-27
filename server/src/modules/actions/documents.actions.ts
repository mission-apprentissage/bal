import Boom from "@hapi/boom";
import { captureException } from "@sentry/node";
import chardet from "chardet";
import { Options } from "csv-parse";
import iconv from "iconv-lite";
import { IJobsSimple } from "job-processor";
import { Filter, FindOneAndUpdateOptions, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { oleoduc, transformData, writeData } from "oleoduc";
import { DOCUMENT_TYPES } from "shared/constants/documents";
import { IDocument, IMailingListDocument, IUploadDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import { IMailingList } from "shared/models/mailingList.model";
import { Readable } from "stream";
import { JsonObject } from "type-fest";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";
import config from "@/config";
import { clamav } from "@/services";

import { sleep } from "../../common/utils/asyncUtils";
import { deleteFromStorage, getFromStorage, uploadToStorage } from "../../common/utils/ovhUtils";
import { DEFAULT_DELIMITER, parseCsv } from "../../common/utils/parserUtils";
import { noop } from "../server/utils/upload.utils";
import {
  IConstructysParsedContentLine,
  importConstructysContent,
  parseConstructysContentLine,
} from "./constructys.actions";
import { DECAParsedContentLine, importDecaContent, parseContentLine } from "./deca.actions";
import { createDocumentContent, deleteDocumentContent } from "./documentContent.actions";
import { MAILING_LIST_DOCUMENT_PREFIX } from "./mailingLists.actions";
import { importOcapiatContent, IOcapiatParsedContentLine, parseOcapiatContentLine } from "./ocapiat.actions";

const testMode = config.env === "test";

export const createDocument = async <T extends IDocument>(data: Omit<T, "created_at" | "updated_at">): Promise<T> => {
  const now = new Date();
  const doc = {
    ...data,
    updated_at: now,
    created_at: now,
  } as T;

  await getDbCollection("documents").insertOne(doc);

  return doc;
};

export const findDocument = async <T extends IDocument>(
  filter: Filter<T>,
  options?: FindOptions<T>
): Promise<T | null> => {
  // @ts-expect-error
  return (await getDbCollection("documents").findOne(filter, options)) as T | null;
};

export const findDocuments = async <T extends IDocument>(filter: Filter<T>, options?: FindOptions<T>): Promise<T[]> => {
  // @ts-expect-error
  const documents = await getDbCollection("documents").find<T>(filter, options).toArray();

  // @ts-expect-error
  return documents as Promise<T[]>;
};

export const updateDocument = async (
  filter: Filter<IDocument>,
  update: UpdateFilter<IDocument>,
  options?: FindOneAndUpdateOptions
): Promise<void> => {
  const updated = await getDbCollection("documents").updateOne(filter, update, {
    ...options,
  });

  if (!updated) {
    throw Boom.internal("Document not found");
  }
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
  const documents = await findDocuments<IUploadDocument>({ kind: "upload" });

  await Promise.all(documents.map((document) => saveDocumentColumns(document)));
};

export const saveDocumentColumns = async (document: IUploadDocument) => {
  let columns: string[] = [];
  try {
    await readDocumentContent(
      document,
      {
        // get only 1 record to get the columns
        to: 1,
        on_record: (record: unknown) => record,
        delimiter: document.delimiter ?? DEFAULT_DELIMITER,
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
  const document = await findDocument<IUploadDocument>({ kind: "upload", type_document: type });

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
  return await getDbCollection("documentContents")
    .aggregate<IDocumentContent>([{ $match: { type_document: type } }, { $sample: { size: 10 } }])
    .toArray();
};

interface ICreateUploadDocumentOptions {
  type_document: string;
  fileSize: number;
  filename: `${string}.${IDocument["ext_fichier"]}`;
  delimiter: string;
  added_by: ObjectId;
}

export const createUploadDocument = async (options: ICreateUploadDocumentOptions): Promise<IUploadDocument> => {
  const documentId = new ObjectId();
  const documentHash = crypto.generateKey();
  const path = `uploads/${documentId}/${options.filename}`;

  if (!options.filename) {
    throw new Error("Missing filename");
  }

  const extFichier = options.filename.split(".").at(-1) as IDocument["ext_fichier"];

  const document = await createDocument<IUploadDocument>({
    _id: documentId,
    kind: "upload",
    type_document: options.type_document,
    ext_fichier: extFichier,
    nom_fichier: options.filename,
    chemin_fichier: path,
    taille_fichier: options.fileSize,
    lines_count: 0,
    import_progress: 0,
    delimiter: options.delimiter,
    hash_secret: documentHash,
    hash_fichier: "",
    added_by: options.added_by.toString(),
    job_id: null,
    job_status: "pending",
  });

  return document;
};

export const createMailingListDocument = async (
  mailingList: IMailingList,
  sourceDocuments: IUploadDocument[]
): Promise<IMailingListDocument> => {
  const documentId = new ObjectId();
  const filename = `${MAILING_LIST_DOCUMENT_PREFIX}-${mailingList.source}-${documentId}.csv`;

  const document = await createDocument<IMailingListDocument>({
    _id: documentId,
    kind: "mailingList",
    type_document: `${MAILING_LIST_DOCUMENT_PREFIX}-${mailingList.source}`,
    ext_fichier: "csv",
    nom_fichier: filename,
    chemin_fichier: `uploads/${documentId}/${filename}`,
    taille_fichier: 0,
    lines_count: sourceDocuments.reduce((acc, sourceDocument) => {
      const lines_count = sourceDocument.lines_count ?? 0;
      return acc + lines_count;
    }, 0),
    process_progress: 0,
    hash_secret: crypto.generateKey(),
    hash_fichier: "",
    added_by: mailingList.added_by,
    job_id: null,
    job_status: "pending",
  });

  return document;
};

interface IUploadDocumentOptions {
  mimetype: string;
}

export const uploadFile = async (
  added_by: string,
  stream: Readable,
  doc: IUploadDocument,
  options: IUploadDocumentOptions
) => {
  const documentHash = doc.hash_secret || crypto.generateKey();
  const path = doc.chemin_fichier;

  const { scanStream, getScanResults } = await clamav.getScanner();
  const { hashStream, getHash } = crypto.checksum();

  if (!options.mimetype) {
    throw Boom.badRequest("Missing mimetype");
  }

  const isCsv = options.mimetype === "text/csv";

  await oleoduc(
    stream,
    isCsv ? transformData(processCsvFile) : noop(),
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
    throw Boom.badRequest("Le contenu du fichier est invalide");
  }

  await updateDocument({ _id: doc._id }, { $set: { hash_fichier } });

  if (isCsv) {
    await checkCsvFile(doc);
  }
};

export const checkCsvFile = async (document: IUploadDocument) => {
  await sleep(3000);
  await readDocumentContent(
    document,
    {
      // get only 1 record to get the columns
      to: 1,
      on_record: (record: unknown) => record,
      delimiter: document.delimiter ?? DEFAULT_DELIMITER,
    },
    async (json: JsonObject) => {
      const columns = Object.keys(json);
      const emptyColumnIndex = columns.findIndex((column) => column === "");
      if (emptyColumnIndex === -1) {
        // save columns
        await updateDocument(
          { _id: document._id },
          {
            $set: {
              columns: columns.sort(),
            },
          }
        );
        return true;
      }

      await deleteDocumentById(document._id);

      throw Boom.badRequest(`Le fichier contient un nom de colonne vide à la position ${emptyColumnIndex + 1}`);
    }
  );
};

export const uploadSupportFile = async (stream: Readable, chemin_fichier: string, options: IUploadDocumentOptions) => {
  const { scanStream, getScanResults } = await clamav.getScanner();

  if (!options.mimetype) {
    throw Boom.badRequest("Missing mimetype");
  }

  await oleoduc(
    stream,
    scanStream,
    testMode
      ? noop()
      : await uploadToStorage(chemin_fichier, {
          contentType: options.mimetype,
          account: "mna",
          storage: "mna-support",
        })
  );

  const { isInfected, viruses } = await getScanResults();

  if (isInfected) {
    if (!testMode) {
      const listViruses = viruses.join(",");
      logger.error(`Uploaded file ${chemin_fichier} is infected by ${listViruses}. Deleting file from storage...`);

      await deleteFromStorage(chemin_fichier);
    }
    throw Boom.badRequest("Le contenu du fichier est invalide");
  }
};

/**
 * Convert a buffer to utf8 if needed and check if file does not contain empty column names
 */
export const processCsvFile = async (chunk: Buffer) => {
  const encoding = chardet.detect(chunk);

  if (!encoding || encoding === "utf8" || !iconv.encodingExists(encoding)) return chunk;

  const toEncodeChunk = iconv.decode(chunk, encoding);
  return iconv.encode(toEncodeChunk, "utf8");
};

export const extractDocumentContent = async (
  {
    document,
    delimiter = DEFAULT_DELIMITER,
    formatter = (line) => line,
  }: {
    document: IDocument;
    delimiter?: string | string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formatter?: (line: any) => any;
  },
  signal: AbortSignal
) => {
  logger.info("conversion csv to json started");
  await updateDocument({ _id: document._id }, [
    {
      $set: {
        lines_count: { $ifNull: ["$lines_count", 0] },
        import_progress: { $ifNull: ["$lines_count", 0] },
      },
    },
  ]);

  let skip = document.lines_count ?? 0;
  let importedLines = 0;
  let importedSize = 0;

  const updateProgress = setInterval(() => {
    if (skip === 0) {
      updateImportProgress(document._id, importedLines, importedSize);
    }
  }, 5_000);

  await readDocumentContent(
    document,
    {
      delimiter,
    },
    async (json: JsonObject) => {
      if (signal.aborted) {
        clearInterval(updateProgress);
        updateImportProgress(document._id, importedLines, importedSize);
        throw signal.reason;
      }

      if (skip === 0) {
        await importDocumentContent(document, [json], formatter);
      } else {
        skip--;
      }
      importedSize += Buffer.byteLength(JSON.stringify(Object.values(json)).replace(/^\[(.*)\]$/, "$1"));
      importedLines += 1;
    }
  );

  clearInterval(updateProgress);

  await updateImportProgress(document._id, importedLines, document.taille_fichier);
  logger.info("conversion csv to json ended");
};

export const updateImportProgress = async (_id: ObjectId, importedLines: number, importedSize: number) => {
  if (importedSize === 0) {
    return;
  }

  await updateDocument(
    { _id },
    {
      $set: {
        lines_count: importedLines,
        import_progress: importedSize,
      },
    }
  );
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
    throw Boom.forbidden("Impossible de trouver le document");
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

export const onImportDocumentJobExited = async (job: IJobsSimple) => {
  let status: IUploadDocument["job_status"] = "pending";
  switch (job.status) {
    case "errored":
      status = "error";
      break;
    case "finished":
      status = "done";
      break;
    case "pending":
      status = "pending";
      break;
    case "paused":
      status = "paused";
      break;
    case "running":
      status = "importing";
      break;
  }

  await updateDocument(
    { job_id: job._id.toString() },
    {
      $set: {
        job_status: status,
        job_error: job.output?.error,
      },
    }
  );
};

export const handleDocumentFileContent = async (
  job: IJobsSimple,
  { document_id }: Record<"document_id", ObjectId>,
  signal: AbortSignal
) => {
  const document = await findDocument<IUploadDocument>({
    _id: document_id,
    kind: "upload",
  });

  if (!document) {
    throw new Error("Processor > /document: Can't find document");
  }

  try {
    await updateDocument({ _id: document._id }, { $set: { job_id: job._id.toString(), job_status: "importing" } });

    switch (document.type_document) {
      case DOCUMENT_TYPES.DECA:
        await extractDocumentContent(
          {
            document,
            delimiter: "|",
            formatter: parseContentLine,
          },
          signal
        );
        break;
      case DOCUMENT_TYPES.OCAPIAT:
        await extractDocumentContent(
          {
            document,
            formatter: parseOcapiatContentLine,
          },
          signal
        );
        break;
      case DOCUMENT_TYPES.CONSTRUCTYS:
        await extractDocumentContent(
          {
            document,
            formatter: parseConstructysContentLine,
          },
          signal
        );
        break;

      default:
        await extractDocumentContent({ document, delimiter: document.delimiter ?? DEFAULT_DELIMITER }, signal);
        break;
    }

    await updateDocument({ _id: document._id }, { $set: { job_error: null, job_status: "done" } });
  } catch (err) {
    if (err === signal.reason) {
      await updateDocument({ _id: document._id }, { $set: { job_status: "paused" } });
    } else {
      await updateDocument({ _id: document._id }, { $set: { job_error: err.stack, job_status: "error" } });
    }
    throw err;
  }
};
