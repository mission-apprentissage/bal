import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { ZPerson } from "../models/person.model";

export const ZReqPostUser = () =>
  z
    .object({
      email: z.string().email(),
      password: z.string(),
      organisation_id: z.string(),
    })
    .strict();

export const SReqPostUser = zodToJsonSchema(ZReqPostUser());
export type IReqPostUser = z.input<ReturnType<typeof ZReqPostUser>>;

export const ZResGetUser = () =>
  z
    .object({
      _id: z.string(),
      email: z.string().email(),
      is_admin: z.boolean().optional(),
      api_key_used_at: z.date().optional(),
      person: ZPerson().optional(),
    })
    .strict();

export const SResGetUser = zodToJsonSchema(ZResGetUser());
export const SResPostUser = SResGetUser;

export type IResGetUser = z.input<ReturnType<typeof ZResGetUser>>;
export type IResPostUser = z.input<ReturnType<typeof ZResGetUser>>;

export const ZResGetUsers = () => z.array(ZResGetUser());
export const SResGetUsers = zodToJsonSchema(ZResGetUsers());
export type IResGetUsers = z.input<ReturnType<typeof ZResGetUsers>>;

export const ZResGetGenerateApiKey = () =>
  z.object({ api_key: z.string() }).strict();
export const SResGetGenerateApiKey = zodToJsonSchema(ZResGetGenerateApiKey());

export type IResGetGenerateApiKey = z.input<
  ReturnType<typeof ZResGetGenerateApiKey>
>;
