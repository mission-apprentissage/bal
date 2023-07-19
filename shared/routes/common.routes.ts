import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const ZResError = () =>
  z
    .object({
      code: z.string().optional(),
      message: z.string(),
      statusCode: z.number(),
    })
    .strict();

export const SResError = zodToJsonSchema(ZResError());
export type IResError = z.input<ReturnType<typeof ZResError>>;

export const ZReqParamsSearchPagination = () =>
  z
    .object({
      page: z.number().optional(),
      limit: z.number().optional(),
      q: z.string().optional(),
    })
    .strict();
export const SReqParamsSearchPagination = zodToJsonSchema(
  ZReqParamsSearchPagination()
);
export type IReqParamsSearchPagination = z.input<
  ReturnType<typeof ZReqParamsSearchPagination>
>;

export const ZReqHeadersAuthorization = () =>
  z.object({
    Authorization: z.string().describe("Bearer token").optional(),
  });

export const SReqHeadersAuthorization = zodToJsonSchema(
  ZReqHeadersAuthorization()
);
