import { Jsonify } from "type-fest";
import { z } from "zod";

export const ZResError = z
  .object({
    code: z.string().nullish(),
    message: z.string(),
    name: z.string(),
    statusCode: z.number(),
  })
  .strict();

export const ZResOk = z.object({}).strict();

export type IResError = z.input<typeof ZResError>;
export type IResErrorJson = Jsonify<z.output<typeof ZResError>>;

export const ZReqParamsSearchPagination = z
  .object({
    page: z.preprocess((v) => parseInt(v as string, 10), z.number().positive().optional()),
    limit: z.preprocess((v) => parseInt(v as string, 10), z.number().positive().optional()),
    q: z.string().optional(),
  })
  .strict();
export type IReqParamsSearchPagination = z.input<typeof ZReqParamsSearchPagination>;

export const ZReqHeadersAuthorization = z
  .object({
    Authorization: z.string().describe("Bearer token").optional(),
  })
  .passthrough();
