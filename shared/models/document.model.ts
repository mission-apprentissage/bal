import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";
import { ZJob, ZJobSimple } from "./job.model";

const collectionName = "documents" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const ZDocument = z
  .object({
    _id: zObjectId,
    type_document: z.string().describe("Le type de document (exemple: DECA, etc..)"),
    ext_fichier: z.enum(["xlsx", "xls", "csv"]).describe("Le type de fichier extension"),
    nom_fichier: z.string().describe("Le nom de fichier"),
    chemin_fichier: z.string().describe("Chemin du fichier binaire"),
    taille_fichier: z.number().int().finite().describe("Taille du fichier en bytes"),
    hash_secret: z.string().describe("Hash fichier"),
    hash_fichier: z.string().describe("Checksum fichier"),
    columns: z.array(z.string()).optional().describe("Liste des colonnes"),
    delimiter: z.string().optional().describe("Délimiteur"),
    import_progress: z.number().finite().optional().describe("Progress percentage (-1 not started)"),
    lines_count: z.number().int().finite().optional().describe("Number of lines"),
    added_by: z.string().describe("Qui a ajouté le fichier"),
    updated_at: z.date().optional().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export const zDocumentPublic = ZDocument.omit({
  hash_fichier: true,
  hash_secret: true,
});

export const zDocumentWithJobs = ZDocument.extend({
  jobs: z.array(ZJob).nullish(),
});

export const zDocumentPublicWithJobs = zDocumentPublic.extend({
  jobs: z.array(ZJobSimple).nullish(),
});

export type IDocument = z.output<typeof ZDocument>;
export type IDocumentJson = Jsonify<z.input<typeof zDocumentPublic>>;

export type IDocumentWithJobs = z.output<typeof zDocumentWithJobs>;
export type IDocumentWithJobsJson = Jsonify<z.input<typeof zDocumentWithJobs>>;

export type IDocumentPublicWithJobs = z.output<typeof zDocumentPublicWithJobs>;
export type IDocumentPublicWithJobsJson = Jsonify<z.input<typeof zDocumentPublicWithJobs>>;

export const toPublicDocument = (document: IDocumentWithJobs): z.output<typeof zDocumentPublicWithJobs> => {
  const { hash_fichier: _hash_fichier, hash_secret: _hash_secret, ...publicDocument } = document;
  return zDocumentPublicWithJobs.parse(publicDocument);
};

export interface IDocumentWithContent<TContent> extends IDocument {
  content: TContent;
}

export default {
  zod: ZDocument,
  indexes,
  collectionName,
};
