import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const ZParamsGetEmailPreview = z.object({ token: z.string() }).strict();
export const SParamsGetEmailPreview = zodToJsonSchema(ZParamsGetEmailPreview);
export type IParamsGetEmailPreview = z.input<typeof ZParamsGetEmailPreview>;

export const ZReqPostEmailsWebHook = z
  .object({
    event: z.string(), //https://developers.sendinblue.com/docs/transactional-webhooks
    "message-id": z.string(),
  })
  .strict();
export const SReqPostEmailsWebHook = zodToJsonSchema(ZReqPostEmailsWebHook);
export type IReqPostEmailsWebHook = z.input<typeof ZReqPostEmailsWebHook>;

// export const SResEmailHTML = {
//   type: "string",
//   format: "buffer",
// } as const;

// export interface IResEmailHTML
//   extends FromSchema<
//     typeof SResEmailHTML,
//     {
//       deserialize: [
//         {
//           pattern: {
//             type: "string";
//             format: "buffer";
//           };
//           output: Buffer;
//         }
//       ];
//     }
//   > {}
