import { z } from "zod/v4-mini";

import { zObjectIdMini } from "zod-mongodb-schema";
import type { Jsonify } from "type-fest";
import { zComputedColumnKey } from "../constants/mailingList";
import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "mailingListsV2" as const;

const indexes: IModelDescriptor["indexes"] = [
  [{ name: 1, created_at: -1 }, {}],
  [{ status: 1, created_at: -1 }, {}],
  [{ ttl: 1 }, { expireAfterSeconds: 0 }],
  [{ created_at: -1 }, {}],
  [{ updated_at: -1 }, {}],
];

const zOutputColumn = z.object({
  input: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("source"),
      name: z.string(),
    }),
    z.object({
      type: z.literal("computed"),
      name: zComputedColumnKey,
    }),
  ]),
  output: z.string(),
  simple: z.boolean(),
});

export type IOutputColumn = z.infer<typeof zOutputColumn>;

export const ZMailingListV2 = z.object({
  _id: zObjectId,
  name: z.string(),
  source: z.object({
    file: z.object({
      hash_fichier: z.string(),
      delimiter: z.string(),
      size: z.number(),
    }),
    lines: z.number(),
    columns: z.array(z.string()),
  }),
  config: z.object({
    email_column: z.string(),
    output_columns: z.array(zOutputColumn),
    lba_columns: z.nullable(
      z.object({
        cle_ministere_educatif: z.string(),
        mef: z.string(),
        cfd: z.string(),
        rncp: z.string(),
        code_postal: z.string(),
        uai_lieu_formation: z.string(),
        uai_formateur: z.string(),
        uai_formateur_responsable: z.string(),
        code_insee: z.string(),
      })
    ),
  }),
  status: z.enum([
    "initial",
    "parse:scheduled",
    "parse:in_progress",
    "parse:failure",
    "parse:success",
    "generate:scheduled",
    "generate:in_progress",
    "generate:failure",
    "generate:success",
    "export:scheduled",
    "export:in_progress",
    "export:failure",
    "export:success",
  ]),
  progress: z.object({
    parse: z.int(),
    generate: z.int(),
    export: z.int(),
  }),
  output: z.object({
    lines: z.number(),
    empty_source_lines: z.number(),
    blacklisted_email_count: z.number(),
    invalid_email_count: z.number(),
  }),
  job_id: z.nullable(zObjectIdMini),
  ttl: z.date(),
  encode_key: z.string(),
  added_by: zObjectIdMini,
  updated_at: z.date(),
  created_at: z.date(),
});

export const zMailingListV2ConfigUpdateQuery = z.partial(ZMailingListV2.shape.config);
export type IMailingListV2ConfigUpdateQuery = z.infer<typeof zMailingListV2ConfigUpdateQuery>;

export type IMailingListV2 = z.infer<typeof ZMailingListV2>;
export type IMailingListV2Json = Jsonify<IMailingListV2>;

export const mailingListModelDescriptorV2 = {
  zod: ZMailingListV2,
  indexes,
  collectionName,
} as const satisfies IModelDescriptor;
