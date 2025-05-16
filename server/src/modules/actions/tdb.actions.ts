import { FindCursor, ObjectId } from "mongodb";

import {
  BrevoContacts,
  BrevoContactStatusEnum,
  IBrevoContactsAPI,
} from "../../../../shared/models/brevo.contacts.model";
import { updateTdbRupturant } from "../../common/apis/tdb";
import { BrevoEventStatus, IBrevoWebhookEvent } from "../../common/services/brevo/brevo";
import {
  getCachedBouncerEmail,
  processHardbounceBouncer,
  verifyEmails,
} from "../../common/services/mailer/mailBouncer";
import { getDbCollection } from "../../common/utils/mongodbUtils";

export async function insertBrevoContactList(contacts: Array<IBrevoContactsAPI>) {
  if (contacts.length === 0) {
    return;
  }
  const currentDate = new Date();
  await getDbCollection("brevo.contacts").bulkWrite(
    contacts.map((contact) => ({
      updateOne: {
        filter: { email: contact.email },
        update: {
          $setOnInsert: {
            _id: new ObjectId(),
            created_at: currentDate,
            updated_at: currentDate,
            email: contact.email,
            status: null,
          },
        },
        upsert: true,
      },
    })),
    { ordered: false }
  );
}
export async function processNewBrevoContact() {
  const cursor = getDbCollection("brevo.contacts").find({ status: null });
  const bulkOps = [];
  const tdbContacts = [];

  for await (const document of cursor) {
    const bouncerEmail = await getCachedBouncerEmail(document.email);
    if (bouncerEmail) {
      tdbContacts.push({
        email: document.email,
        status: bouncerEmail.status,
      });
    }

    bulkOps.push(
      bouncerEmail
        ? {
            updateOne: {
              filter: { email: document.email },
              update: {
                $set: {
                  status: BrevoContactStatusEnum.done,
                  updated_at: new Date(),
                },
              },
            },
          }
        : {
            updateOne: {
              filter: { email: document.email },
              update: {
                $set: {
                  status: BrevoContactStatusEnum.queued,
                  updated_at: new Date(),
                },
              },
            },
          }
    );
  }

  await updateTdbRupturant(tdbContacts);

  if (bulkOps.length === 0) {
    return;
  }

  await getDbCollection("brevo.contacts").bulkWrite(bulkOps);
}

export async function processQueuedBrevoContact() {
  async function* generator(cursor: FindCursor<BrevoContacts>, chunkSize: number = 100) {
    const emailsMap = new Map<string, BrevoContacts>();
    for await (const document of cursor) {
      emailsMap.set(document.email, document);

      if (emailsMap.size === chunkSize) {
        const emailsResult = await verifyEmails([...emailsMap.keys()]);
        yield { emailsResult, emailsMap };
        emailsMap.clear();
      }
    }
    if (emailsMap.size > 0) {
      const emailsResult = await verifyEmails([...emailsMap.keys()]);
      yield { emailsResult, emailsMap };
    }
  }

  const cursor = getDbCollection("brevo.contacts").find({ status: BrevoContactStatusEnum.queued });

  for await (const chunk of generator(cursor, 100)) {
    if (chunk.emailsResult.length === 0) {
      continue;
    }

    const bulkOps = chunk.emailsResult.map((item) => ({
      updateOne: {
        filter: { email: item.email },
        update: {
          $set: {
            status: BrevoContactStatusEnum.done,
            updated_at: new Date(),
          },
        },
      },
    }));

    await updateTdbRupturant(
      chunk.emailsResult.map((item) => ({
        email: item.email,
        status: item.ping.status,
      }))
    );

    await getDbCollection("brevo.contacts").bulkWrite(bulkOps);
  }
}

export async function processHardbounce(payload: IBrevoWebhookEvent) {
  const { event, email } = payload;

  if (event === BrevoEventStatus.HARD_BOUNCE) {
    await processHardbounceBouncer(email);
    await updateTdbRupturant([{ email, status: "invalid" }]);
  }
}
