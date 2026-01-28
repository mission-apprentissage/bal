import { EmailStatus } from "shared/models/data/lba.mailingList.model";
import { getDbCollection } from "../../../common/utils/mongodbUtils";
import { verifyEmails } from "../../../common/services/mailer/mailBouncer";
import logger from "../../../common/logger";

export async function verifyCompanyEmails(signal: AbortSignal): Promise<void> {
  logger.info("Starting verification of company emails for LBA mailing list...");

  const emailsToVerify: Set<string> = new Set();
  for await (const doc of getDbCollection("lba.mailingLists").find({
    emailStatus: EmailStatus.UNVERIFIED,
  })) {
    emailsToVerify.add(doc.email);
  }

  logger.info(`Found ${emailsToVerify.size} company emails to verify. Starting verification with Bouncer...`);
  const pingResults = await verifyEmails(Array.from(emailsToVerify), signal);

  logger.info("Updating company email statuses in the database...");

  const now = new Date();
  for (let i = 0; i < pingResults.length; i++) {
    await getDbCollection("lba.mailingLists").updateMany(
      { email: pingResults[i].email },
      {
        $set: {
          emailStatus: pingResults[i].ping.status === "valid" ? EmailStatus.VALID : EmailStatus.INVALID,
          updated_at: now,
        },
      }
    );
  }
}
