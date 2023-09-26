import { captureException } from "@sentry/node";
import { Filter, FindOneAndUpdateOptions, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { oleoduc } from "oleoduc";
import { IDocument } from "shared/models/document.model";
import { Readable } from "stream";

import logger from "@/common/logger";
import * as crypto from "@/common/utils/cryptoUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";
import config from "@/config";
import { clamav } from "@/services";

import { deleteFromStorage, uploadToStorage } from "../../common/utils/ovhUtils";
import { noop } from "../server/utils/upload.utils";

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
  return getDbCollection("documents").distinct("type_document");
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
      taille_fichier: options.fileSize,
      hash_secret: documentHash,
      hash_fichier,
      added_by,
      updated_at: new Date(),
      created_at: new Date(),
    });
  }

  return documentId;
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

  await getDbCollection("documents").deleteOne({ _id: document._id });
};
