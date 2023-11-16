import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "documents" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ job_id: 1 }, {}],
  [{ kind: 1, created_at: 1 }, {}],
];

export const ZUploadDocument = z
  .object({
    _id: zObjectId,
    kind: z.literal("upload"),
    type_document: z.string().describe("Le type de document (exemple: DECA, etc..)"),
    ext_fichier: z.enum(["xlsx", "xls", "csv"]).describe("Le type de fichier extension"),
    nom_fichier: z.string().describe("Le nom de fichier"),
    chemin_fichier: z.string().describe("Chemin du fichier binaire"),
    taille_fichier: z.number().int().finite().describe("Taille du fichier en bytes"),
    hash_secret: z.string().describe("Hash fichier"),
    hash_fichier: z.string().describe("Checksum fichier"),
    columns: z.array(z.string()).nullish().describe("Liste des colonnes"),
    delimiter: z.string().nullish().describe("Délimiteur"),
    import_progress: z.number().finite().nullish().describe("Progress percentage (-1 not started)"),
    lines_count: z.number().int().finite().nullish().describe("Number of lines"),
    added_by: z.string().describe("Qui a ajouté le fichier"),
    updated_at: z.date().nullish().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
    job_id: z.string().nullish().describe("Identifiant du job de génération"),
    job_status: z.enum(["pending", "importing", "done", "error"]).describe("Status du job de génération"),
    job_error: z.string().nullish().describe("Erreur du job de génération"),
  })
  .strict();

export const ZMailingListDocument = z
  .object({
    _id: zObjectId,
    kind: z.literal("mailingList"),
    type_document: z.string().describe("Le type de document (exemple: DECA, etc..)"),
    ext_fichier: z.enum(["xlsx", "xls", "csv"]).describe("Le type de fichier extension"),
    nom_fichier: z.string().describe("Le nom de fichier"),
    chemin_fichier: z.string().describe("Chemin du fichier binaire"),
    taille_fichier: z.number().int().finite().describe("Taille du fichier en bytes"),
    hash_secret: z.string().describe("Hash fichier"),
    hash_fichier: z.string().describe("Checksum fichier"),
    process_progress: z.number().finite().optional().describe("Number of lines processed"),
    lines_count: z.number().int().finite().optional().describe("Number of lines"),
    added_by: z.string().describe("Qui a ajouté le fichier"),
    updated_at: z.date().optional().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
    job_id: z.string().nullish().describe("Identifiant du job de génération"),
    job_status: z.enum(["pending", "processing", "done", "error"]).describe("Status du job de génération"),
  })
  .strict();

export const ZDocument = z.discriminatedUnion("kind", [ZUploadDocument, ZMailingListDocument]);

export const ZUploadDocumentPublic = ZUploadDocument.omit({
  hash_fichier: true,
  hash_secret: true,
});

export const ZMailingListDocumentPublic = ZMailingListDocument.omit({
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
  // @ts-expect-error invalid union support
  return document.kind === "upload"
    ? ZUploadDocumentPublic.parse(publicDocument)
    : ZMailingListDocumentPublic.parse(publicDocument);
};

export default {
  zod: ZDocument,
  indexes,
  collectionName,
};
