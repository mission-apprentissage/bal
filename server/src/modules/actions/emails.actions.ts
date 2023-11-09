import { TemplateName } from "shared/mailer";
import { IEvent } from "shared/models/events/event.model";

import { getEmailInfos } from "@/common/services/mailer/mailer";
import { generateHtml } from "@/common/utils/emailsUtils";
import { getDbCollection } from "@/common/utils/mongodbUtils";

export function addEmail(
  person_id: string,
  token: string,
  templateName: string,
  payload: IEvent["payload"]["emails"][number]["payload"]
) {
  const now = new Date();
  return getDbCollection("events").findOneAndUpdate(
    { person_id, name: "bal_emails" },
    {
      // @ts-ignore
      $push: {
        "payload.emails": {
          token,
          templateName,
          payload,
          sendDates: [now],
        },
      },
      $set: {
        updated_at: now,
      },
      $setOnInsert: {
        created_at: now,
      },
    },
    { returnDocument: "after", upsert: true }
  );
}

export function addEmailMessageId(token: string, messageId: string) {
  return getDbCollection("events").findOneAndUpdate(
    { "payload.emails.token": token, name: "bal_emails" },
    {
      // @ts-ignore
      $addToSet: {
        "payload.emails.$.messageIds": messageId,
      },
      $unset: {
        "payload.emails.$.error": 1,
      },
      $set: {
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

export function addEmailError(token: string, e: Error) {
  return getDbCollection("events").findOneAndUpdate(
    { "payload.emails.token": token, name: "bal_emails" },
    {
      $set: {
        "payload.emails.$.error": {
          err_type: "fatal",
          message: e.message,
        },
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

export async function markEmailAsDelivered(messageId: string) {
  return getDbCollection("events").findOneAndUpdate(
    { name: "bal_emails", "payload.emails.messageIds": messageId },
    {
      $unset: {
        "payload.emails.$.error": 1,
      },
      $set: {
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

export async function markEmailAsFailed(messageId: string, type: string) {
  return getDbCollection("events").findOneAndUpdate(
    { name: "bal_emails", "payload.emails.messageIds": messageId },
    {
      $set: {
        "payload.emails.$.error": {
          err_type: type,
        },
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

export async function markEmailAsOpened(token: string) {
  return getDbCollection("events").findOneAndUpdate(
    { "payload.emails.token": token, name: "bal_emails" },
    {
      $set: {
        "payload.emails.$.openDate": new Date(),
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

// TODO
export async function unsubscribeUser(id: string) {
  return getDbCollection("events").findOneAndUpdate(
    {
      $or: [{ "payload.emails.token": id }, { "payload.emails.payload.recipient.email": id }],
      name: "bal_emails",
    },
    {
      $set: {
        "payload.unsubscribe": true,
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

export async function renderEmail(token: string) {
  const event = await getDbCollection("events").findOne<IEvent>({
    "payload.emails.token": token,
    name: "bal_emails",
  });
  if (!event) {
    return;
  }
  const email = event.payload.emails.find((e) => e.token === token);
  if (!email) {
    return;
  }
  const { templateName, payload } = email;
  return generateHtml(
    payload.recipient.email,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEmailInfos(templateName as TemplateName, payload as any)
  );
}

export async function checkIfEmailExists(token: string) {
  const count = await getDbCollection("events").countDocuments({
    "payload.emails.token": token,
    name: "bal_emails",
  });
  return count > 0;
}
