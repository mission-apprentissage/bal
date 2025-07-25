import type { Jsonify } from "type-fest";
import { z } from "zod/v4-mini";

import type { IModelDescriptor } from "./common";
import { zObjectId } from "./common";

const collectionName = "sessions" as const;

const indexes: IModelDescriptor["indexes"] = [[{ expires_at: 1 }, { expireAfterSeconds: 0 }]];

export const ZSession = z.object({
  _id: zObjectId,
  token: z.string(),
  updated_at: z.date(),
  created_at: z.date(),
  expires_at: z.date(),
});

export type ISession = z.output<typeof ZSession>;
export type ISessionJson = Jsonify<z.input<typeof ZSession>>;

export default {
  zod: ZSession,
  indexes,
  collectionName,
};
