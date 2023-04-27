import { MultipartFile } from "@fastify/multipart";
import {
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  ObjectId,
  UpdateFilter,
} from "mongodb";
// @ts-ignore
import { oleoduc } from "oleoduc";
import { IDocument } from "shared/models/document.model";
import { IUser } from "shared/models/user.model";

import { config } from "../../../config/config";
import { clamav } from "../../services";
import * as crypto from "../../utils/cryptoUtils";
import logger from "../../utils/logger";
import { getDbCollection } from "../../utils/mongodb";
import { deleteFromStorage, uploadToStorage } from "../../utils/ovhUtils";
import { noop } from "../server/utils/upload.utils";

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
}

export const uploadDocument = async (
  user: IUser,
  data: MultipartFile,
  options: IUploadDocumentOptions
) => {
  const documentId = new ObjectId();
  const documentHash = crypto.generateKey();
  const path = `uploads/${documentId}/${data.filename}`;

  const { scanStream, getScanResults } = await clamav.getScanner();
  const { hashStream, getHash } = crypto.checksum();

  await oleoduc(
    data.file,
    scanStream,
    hashStream,
    crypto.isCipherAvailable() ? crypto.cipher(documentHash) : noop(), // ISSUE
    testMode
      ? noop()
      : await uploadToStorage(path, {
          contentType: data.mimetype,
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
    ext_fichier: data.filename.split(".").pop(),
    nom_fichier: data.filename,
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
