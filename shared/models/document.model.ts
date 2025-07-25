import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "documents" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ job_id: 1 }, {}],
  [{ kind: 1, created_at: 1 }, {}],
];

export const ZUploadDocument = z.object({
  _id: zObjectId,
  kind: z.literal("upload"),
  type_document: z.string(), // Le type de document (exemple: DECA, etc..)"
  ext_fichier: z.enum(["xlsx", "xls", "csv"]), //Le type de fichier extension"
  nom_fichier: z.string(), // Le nom de fichier"
  chemin_fichier: z.string(), // Chemin du fichier binaire"
  taille_fichier: z.int(), // Taille du fichier en bytes"
  hash_secret: z.string(), // Hash fichier"
  hash_fichier: z.string(), // Checksum fichier"
  columns: z.nullish(z.array(z.string())), // Liste des colonnes"
  delimiter: z.nullish(z.string()), //Délimiteur"
  import_progress: z.nullish(z.number()), // Progress percentage (-1 not started)"
  lines_count: z.nullish(z.int()), // Number of lines"
  added_by: z.string(), // Qui a ajouté le fichier"
  updated_at: z.nullish(z.date()), // Date de mise à jour en base de données"
  created_at: z.date(), // Date d'ajout en base de données"
  job_id: z.nullish(z.string()), //Identifiant du job de génération"
  job_status: z.enum(["pending", "paused", "importing", "done", "error"]), //Status du job de génération"
  job_error: z.nullish(z.string()), //Erreur du job de génération"
});

export const ZMailingListDocument = z.object({
  _id: zObjectId,
  kind: z.literal("mailingList"),
  type_document: z.string(), // Le type de document (exemple: DECA, etc..)"
  ext_fichier: z.enum(["xlsx", "xls", "csv"]), //Le type de fichier extension"
  nom_fichier: z.string(), // Le nom de fichier"
  chemin_fichier: z.string(), // Chemin du fichier binaire"
  taille_fichier: z.int(), // Taille du fichier en bytes"
  hash_secret: z.string(), // Hash fichier"
  hash_fichier: z.string(), // Checksum fichier"
  process_progress: z.optional(z.number()), // Number of lines processed"
  lines_count: z.optional(z.int()), // Number of lines"
  added_by: z.string(), // Qui a ajouté le fichier"
  updated_at: z.optional(z.date()), //Date de mise à jour en base de données"
  created_at: z.date(), // Date d'ajout en base de données"
  job_id: z.nullish(z.string()), //Identifiant du job de génération"
  job_status: z.enum(["pending", "paused", "processing", "done", "error"]), //Status du job de génération"
});

export const ZDocument = z.discriminatedUnion("kind", [ZUploadDocument, ZMailingListDocument]);

export const ZUploadDocumentPublic = z.omit(ZUploadDocument, {
  hash_fichier: true,
  hash_secret: true,
});

export const ZMailingListDocumentPublic = z.omit(ZMailingListDocument, {
  hash_fichier: true,
  hash_secret: true,
});

export const zDocumentPublic = z.discriminatedUnion("kind", [ZUploadDocumentPublic, ZMailingListDocumentPublic]);

export type IDocument = z.output<typeof ZDocument>;
export type IUploadDocument = z.output<typeof ZUploadDocument>;
export type IMailingListDocument = z.output<typeof ZMailingListDocument>;
export type IDocumentJson = Jsonify<z.input<typeof zDocumentPublic>>;
export type IUploadDocumentJson = Jsonify<z.input<typeof ZUploadDocumentPublic>>;

export const toPublicDocument = <T extends IDocument>(
  document: T
): T extends IUploadDocument ? z.output<typeof ZUploadDocumentPublic> : z.output<typeof ZMailingListDocumentPublic> => {
  const { hash_fichier: _hash_fichier, hash_secret: _hash_secret, ...publicDocument } = document;
  if (document.kind === "upload") {
    // @ts-expect-error invalid union support
    return ZUploadDocumentPublic.parse(publicDocument);
  }

  // @ts-expect-error invalid union support
  return ZMailingListDocumentPublic.parse(publicDocument);
};

export default {
  zod: ZDocument,
  indexes,
  collectionName,
};
