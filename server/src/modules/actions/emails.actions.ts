import { TemplateName, TemplatePayloads } from "shared/mailer";
import { IBalEmail } from "shared/models/events/bal_emails.event";
import { IEvent } from "shared/models/events/event.model";
import { v4 as uuidv4 } from "uuid";

import logger from "@/common/logger";
import { getEmailInfos } from "@/common/services/mailer/mailer";
import { mailer } from "@/services";
import { generateHtml } from "@/utils/emailsUtils";
import { getDbCollection } from "@/utils/mongodbUtils";

function addEmail(
  person_id: string,
  token: string,
  templateName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any
) {
  return getDbCollection("events").findOneAndUpdate(
    { person_id, name: "bal_emails" },
    {
      // @ts-ignore
      $push: {
        "payload.emails": {
          token,
          templateName,
          payload,
          sendDates: [new Date()],
        },
      },
    },
    { returnDocument: "after", upsert: true }
  );
}

function addEmailMessageId(token, messageId) {
  return getDbCollection("events").findOneAndUpdate(
    { "payload.emails.token": token, name: "bal_emails" },
    {
      $addToSet: {
        "payload.emails.$.messageIds": messageId,
      },
      $unset: {
        "payload.emails.$.error": 1,
      },
    },
    { returnDocument: "after" }
  );
}

function addEmailError(token, e) {
  return getDbCollection("events").findOneAndUpdate(
    { "payload.emails.token": token, name: "bal_emails" },
    {
      $set: {
        "payload.emails.$.error": {
          err_type: "fatal",
          message: e.message,
        },
      },
    },
    { returnDocument: "after" }
  );
}

export async function markEmailAsDelivered(messageId) {
  return getDbCollection("events").findOneAndUpdate(
    { name: "bal_emails", "payload.emails.messageIds": messageId },
    {
      $unset: {
        "payload.emails.$.error": 1,
      },
    },
    { returnDocument: "after" }
  );
}

export async function markEmailAsFailed(messageId, type) {
  return getDbCollection("events").findOneAndUpdate(
    { name: "bal_emails", "payload.emails.messageIds": messageId },
    {
      $set: {
        "payload.emails.$.error": {
          err_type: type,
        },
      },
    },
    { returnDocument: "after" }
  );
}

export async function markEmailAsOpened(token) {
  return getDbCollection("events").findOneAndUpdate(
    { "payload.emails.token": token, name: "bal_emails" },
    {
      $set: {
        "payload.emails.$.openDate": new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

// TODO
export async function unsubscribeUser(id) {
  return getDbCollection("events").findOneAndUpdate(
    {
      $or: [
        { "payload.emails.token": id },
        { "payload.emails.payload.recipient.email": id },
      ],
      name: "bal_emails",
    },
    {
      $set: {
        "payload.unsubscribe": true,
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
  const { templateName, payload } = event.payload.emails.find(
    (e) => e.token === token
  ) as IBalEmail;
  return generateHtml(
    payload.recipient.email,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getEmailInfos(templateName as TemplateName, payload as any)
  );
}

export async function checkIfEmailExists(token) {
  const count = await getDbCollection("events").countDocuments({
    "payload.emails.token": token,
    name: "bal_emails",
  });
  return count > 0;
}

// version intermédiaire qui prend le template en paramètre (constuit et vérifié au préalable avec TS)
export async function sendStoredEmail<T extends TemplateName>(
  person_id: string,
  templateName: T,
  payload: TemplatePayloads[T],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template: any
): Promise<void> {
  const emailToken = uuidv4();
  try {
    template.data.token = emailToken;
    await addEmail(person_id, emailToken, templateName, payload);
    const messageId = await mailer.sendEmailMessage(
      payload.recipient.email,
      template
    );
    await addEmailMessageId(emailToken, messageId);
  } catch (err: unknown) {
    logger.error({ err, template: templateName }, "error sending email");
    await addEmailError(emailToken, err);
  }
}
