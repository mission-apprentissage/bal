import { FindCursor } from "mongodb";

import { BouncerEmailPending } from "../../../../shared/models/bouncer.email.pending.model";
import { updateTdbRupturant } from "../../common/apis/tdb";
import { verifyEmails } from "../../common/services/mailer/mailBouncer";
import { getDbCollection } from "../../common/utils/mongodbUtils";

export async function insertPendingEmail(email: string) {
  await getDbCollection("bouncer.email.pending").updateOne(
    {
      email: email,
    },
    {
      $setOnInsert: {
        email,
        created_at: new Date(),
        updated_at: new Date(),
        treated: false,
      },
    },
    {
      upsert: true,
    }
  );
}

export async function processPendingEmail() {
  async function* generator(cursor: FindCursor<BouncerEmailPending>, chunkSize: number = 100) {
    let emailsArr: Array<string> = [];
    for await (const document of cursor) {
      emailsArr.push(document.email);
      if (emailsArr.length === chunkSize) {
        const emailsResult = await verifyEmails(emailsArr);
        yield emailsResult;
        emailsArr = [];
      }
    }
    if (emailsArr.length > 0) {
      const emailsResult = await verifyEmails(emailsArr);
      yield emailsResult;
    }
  }

  const cursor = getDbCollection("bouncer.email.pending").find({ treated: false });

  for await (const chunk of generator(cursor, 100)) {
    const bulkOps = chunk.map((item) => ({
      updateOne: {
        filter: { email: item.email },
        update: {
          $set: {
            treated: true,
            updated_at: new Date(),
          },
        },
      },
    }));

    await getDbCollection("bouncer.email.pending").bulkWrite(bulkOps);
    await updateTdbRupturant(chunk);
  }
}
