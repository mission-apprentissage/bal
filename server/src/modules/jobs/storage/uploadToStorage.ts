import { createReadStream } from "fs";
import { pipeline } from "stream/promises";
import { z } from "zod/v4-mini";

import logger from "@/common/logger";
import { uploadToStorage } from "@/common/utils/ovhUtils";

const zUploadPayload = z.object({
  file: z.string(),
  path: z.string(),
  account: z._default(z.enum(["main", "support"]), "main"),
  ttl: z._default(z.coerce.number(), 60 * 60 * 24 * 90),
  contentType: z._default(z.string(), "application/octet-stream"),
});

export async function uploadFileToStorage(payload: unknown): Promise<void> {
  const { file, path, account, ttl, contentType } = zUploadPayload.parse(payload);

  const uploadStream = await uploadToStorage(path, account, ttl, contentType);
  await pipeline(createReadStream(file), uploadStream);
  logger.info(`Upload terminé : ${path}`);
}
