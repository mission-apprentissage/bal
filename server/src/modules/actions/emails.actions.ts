import { TemplateName, TemplatePayloads } from "shared/mailer";
import { v4 as uuidv4 } from "uuid";

// import { usersMigrationDb } from "../../model/collections.js";
import { mailer } from "../../services";
// import { generateHtml } from "../../utils/emailsUtils";
import logger from "../../utils/logger";
import { getDbCollection } from "../../utils/mongodb";
// import { getEmailInfos } from "../services/mailer/mailer";

function addEmail(
  person_id: string,
  token: string,
  templateName: string,
  payload: any
) {
  return getDbCollection("events").findOneAndUpdate(
    { person_id, type: "bal_emails" },
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
    { "payload.emails.token": token, type: "bal_emails" },
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
    { "payload.emails.token": token, type: "bal_emails" },
    {
      $set: {
        "payload.emails.$.error": {
          type: "fatal",
          message: e.message,
        },
      },
    },
    { returnDocument: "after" }
  );
}

// export async function markEmailAsDelivered(messageId) {
//   return usersMigrationDb().findOneAndUpdate(
//     { "emails.messageIds": messageId },
//     {
//       $unset: {
//         "emails.$.error": 1,
//       },
//     },
//     { returnDocument: "after" }
//   );
// }

// export async function markEmailAsFailed(messageId, type) {
//   return usersMigrationDb().findOneAndUpdate(
//     { "emails.messageIds": messageId },
//     {
//       $set: {
//         "emails.$.error": {
//           type,
//         },
//       },
//     },
//     { returnDocument: "after" }
//   );
// }

// export async function markEmailAsOpened(token) {
//   return usersMigrationDb().findOneAndUpdate(
//     { "emails.token": token },
//     {
//       $set: {
//         "emails.$.openDate": new Date(),
//       },
//     },
//     { returnDocument: "after" }
//   );
// }

// export async function unsubscribeUser(id) {
//   return usersMigrationDb().findOneAndUpdate(
//     { $or: [{ email: id }, { "emails.token": id }] },
//     {
//       $set: {
//         unsubscribe: true,
//       },
//     },
//     { returnDocument: "after" }
//   );
// }

// export async function renderEmail(token: string) {
//   const user: any = await usersMigrationDb().findOne({ "emails.token": token });
//   const { templateName, payload } = user.emails.find((e) => e.token === token);
//   return generateHtml(
//     user.email,
//     getEmailInfos(templateName as TemplateName, payload)
//   );
// }

// export async function checkIfEmailExists(token) {
//   const count = await usersMigrationDb().countDocuments({
//     "emails.token": token,
//   });
//   return count > 0;
// }

// version intermédiaire qui prend le template en paramètre (constuit et vérifié au préalable avec TS)
export async function sendStoredEmail<T extends TemplateName>(
  person_id: string,
  templateName: T,
  payload: TemplatePayloads[T],
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
  } catch (err: any) {
    logger.error({ err, template: templateName }, "error sending email");
    await addEmailError(emailToken, err);
  }
}
