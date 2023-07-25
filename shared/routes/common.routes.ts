import { Jsonify } from "type-fest";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const ZResError = z
  .object({
    code: z.string().nullish(),
    message: z.string(),
    name: z.string(),
    statusCode: z.number(),
  })
  .strict();

export const SResError = zodToJsonSchema(ZResError);
export type IResError = z.input<typeof ZResError>;
export type IResErrorJson = Jsonify<z.output<typeof ZResError>>;

export const ZReqParamsSearchPagination = z
  .object({
    page: z.number().optional(),
    limit: z.number().optional(),
    q: z.string().optional(),
  })
  .strict();
export type IReqParamsSearchPagination = z.input<
  typeof ZReqParamsSearchPagination
>;

export const ZReqHeadersAuthorization = z.object({
  Authorization: z.string().describe("Bearer token").optional(),
});
