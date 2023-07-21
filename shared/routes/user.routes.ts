import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { ZPerson } from "../models/person.model";
import { ZUser } from "../models/user.model";

export const ZReqPostUser = z
  .object({
    email: z.string().email(),
    password: z.string(),
    organisation_id: z.string(),
  })
  .strict();

export const SReqPostUser = zodToJsonSchema(ZReqPostUser);
export type IReqPostUser = z.input<typeof ZReqPostUser>;

export const ZResGetUser = ZUser.pick({
  _id: true,
  email: true,
  is_admin: true,
  api_key_used_at: true,
})
  .extend({
    person: ZPerson.optional(),
  })
  .strict();

export const SResGetUser = zodToJsonSchema(ZResGetUser);
export const SResPostUser = SResGetUser;

export type IResGetUser = z.input<typeof ZResGetUser>;
export type IResPostUser = z.input<typeof ZResGetUser>;

export const ZResGetUsers = z.array(ZResGetUser);
export const SResGetUsers = zodToJsonSchema(ZResGetUsers);
export type IResGetUsers = z.input<typeof ZResGetUsers>;

export const ZResGetGenerateApiKey = z.object({ api_key: z.string() }).strict();
export const SResGetGenerateApiKey = zodToJsonSchema(ZResGetGenerateApiKey);

export type IResGetGenerateApiKey = z.input<typeof ZResGetGenerateApiKey>;
