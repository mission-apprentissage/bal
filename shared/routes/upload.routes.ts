import { ObjectId } from "mongodb";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export enum DOCUMENT_TYPES {
  DECA = "DECA",
  VOEUX_PARCOURSUP_MAI_2023 = "Voeux Parcoursup Mai 2023",
  VOEUX_AFFELNET_MAI_2023 = "Voeux Affelnet Mai 2023",
  VOEUX_AFFELNET_JUIN_2023 = "Voeux Affelnet Juin 2023",
}

export const ZReqQueryPostAdminUpload = () =>
  z
    .object({
      type_document: z.string(),
    })
    .strict();

export const SReqQueryPostAdminUpload = zodToJsonSchema(
  ZReqQueryPostAdminUpload()
);
export type IReqQueryPostAdminUpload = z.input<
  ReturnType<typeof ZReqQueryPostAdminUpload>
>;

export const ZResPostAdminUpload = () =>
  z
    .object({
      _id: z.instanceof(ObjectId),
      type_document: z.string().optional(),
      ext_fichier: z.string(),
      nom_fichier: z.string(),
      chemin_fichier: z.string(),
      taille_fichier: z.number(),
      import_progress: z.number().optional(),
      lines_count: z.number().optional(),
      added_by: z.string(),
      updated_at: z.date(),
      created_at: z.date(),
    })
    .strict();
export const SResPostAdminUpload = zodToJsonSchema(ZResPostAdminUpload());
export type IResPostAdminUpload = z.input<
  ReturnType<typeof ZResPostAdminUpload>
>;

export const ZResGetDocuments = () => z.array(ZResPostAdminUpload());
export const SResGetDocuments = zodToJsonSchema(ZResGetDocuments());
export type IResGetDocuments = z.input<ReturnType<typeof ZResGetDocuments>>;

export const ZResGetDocumentTypes = () => z.array(z.string());
export const SResGetDocumentTypes = zodToJsonSchema(ZResGetDocumentTypes());

export type IResGetDocumentTypes = z.input<
  ReturnType<typeof ZResGetDocumentTypes>
>;
