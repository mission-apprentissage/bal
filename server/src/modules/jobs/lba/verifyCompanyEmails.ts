import { EmailStatus } from "shared/models/data/lba.mailingList.model";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { verifyEmails } from "../../../common/services/mailer/mailBouncer";
import logger from "../../../common/logger";

const CHUNK_SIZE = 1_000;

export async function verifyCompanyEmails(signal: AbortSignal): Promise<void> {
  logger.info("Starting verification of company emails for LBA mailing list...");

  const cursor = getDbCollection("lba.mailingLists").find(
    { emailStatus: EmailStatus.UNVERIFIED },
    { projection: { email: 1 } }
  );

  let chunk: string[] = [];
  let totalProcessed = 0;
  let chunkIndex = 0;

  const processChunk = async (emails: string[]) => {
    const uniqueEmails = [...new Set(emails)];
    chunkIndex++;
    logger.info(`Processing chunk ${chunkIndex} (${uniqueEmails.length} unique emails)...`);

    const pingResults = await verifyEmails(uniqueEmails, signal);

    const now = new Date();
    await getDbCollection("lba.mailingLists").bulkWrite(
      pingResults.map((result) => ({
        updateMany: {
          filter: { email: result.email },
          update: {
            $set: {
              emailStatus: result.ping.status === "valid" ? EmailStatus.VALID : EmailStatus.INVALID,
              updated_at: now,
            },
          },
        },
      })),
      { ordered: false }
    );

    totalProcessed += uniqueEmails.length;
    logger.info(`Chunk ${chunkIndex} done. Total processed: ${totalProcessed}`);
  };

  for await (const doc of cursor) {
    signal.throwIfAborted();
    chunk.push(doc.email);

    if (chunk.length >= CHUNK_SIZE) {
      await processChunk(chunk);
      chunk = [];
    }
  }

  if (chunk.length > 0) {
    await processChunk(chunk);
  }

  logger.info(`Verification complete. Total emails processed: ${totalProcessed}`);
}
