import { FromSchema } from "json-schema-to-ts";

export const SParamsGetEmailPreview = {
  type: "object",
  properties: {
    token: { type: "string" },
  },
  required: ["token"],
} as const;

export type IParamsGetEmailPreview = FromSchema<typeof SParamsGetEmailPreview>;

export const SReqPostEmailsWebHook = {
  type: "object",
  properties: {
    event: { type: "string" }, //https://developers.sendinblue.com/docs/transactional-webhooks
    "message-id": { type: "string" },
  },
  required: ["event", "message-id"],
} as const;

export type IReqPostEmailsWebHook = FromSchema<typeof SReqPostEmailsWebHook>;

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
