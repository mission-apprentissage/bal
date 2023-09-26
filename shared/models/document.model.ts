import { Jsonify } from "type-fest";
import { z } from "zod";

import { IModelDescriptor, zObjectId } from "./common";

const collectionName = "documents" as const;

const indexes: IModelDescriptor["indexes"] = [];

export const ZDocument = z
  .object({
    _id: zObjectId,
    type_document: z.string().describe("Le type de document (exemple: DECA, etc..)"),
    ext_fichier: z.string().describe("Le type de fichier extension"),
    nom_fichier: z.string().describe("Le nom de fichier"),
    chemin_fichier: z.string().describe("Chemin du fichier binaire"),
    taille_fichier: z.number().int().finite().describe("Taille du fichier en bytes"),
    hash_secret: z.string().describe("Hash fichier"),
    hash_fichier: z.string().describe("Checksum fichier"),
    added_by: z.string().describe("Qui a ajouté le fichier"),
    updated_at: z.date().optional().describe("Date de mise à jour en base de données"),
    created_at: z.date().describe("Date d'ajout en base de données"),
  })
  .strict();

export const zDocumentPublic = ZDocument.omit({
  hash_fichier: true,
  hash_secret: true,
});

export type IDocument = z.output<typeof ZDocument>;
export type IDocumentJson = Jsonify<z.input<typeof zDocumentPublic>>;

export const toPublicDocument = (document: z.infer<typeof ZDocument>) => {
  const { hash_fichier: _hash_fichier, hash_secret: _hash_secret, ...publicDocument } = document;

  return zDocumentPublic.parse(publicDocument);
};

export default {
  zod: ZDocument,
  indexes,
  collectionName,
};
