import { ObjectId } from "mongodb";
import type { IEmailError, IEventBalEmail } from "shared/models/events/bal_emails.event";

import { getDbCollection } from "@/common/utils/mongodbUtils";

export async function createBalEmailEvent(person_id: string, template: IEventBalEmail["template"]) {
  const now = new Date();

  const event: IEventBalEmail = {
    _id: new ObjectId(),
    type: "email.bal",
    person_id,
    template,
    opened_at: null,
    delivered_at: null,
    created_at: now,
    updated_at: now,
    messageId: null,
    errors: [],
  };

  await getDbCollection("events").insertOne(event);
  return event;
}

export async function setEmailMessageId(emailEvent: IEventBalEmail, messageId: string) {
  return getDbCollection("events").findOneAndUpdate(
    { _id: emailEvent._id },
    {
      $set: {
        updated_at: new Date(),
        messageId,
      },
    },
    { returnDocument: "after" }
  );
}

export async function addEmailError(
  filter: Pick<IEventBalEmail, "_id"> | Pick<IEventBalEmail, "messageId">,
  err: IEmailError
) {
  return getDbCollection("events").findOneAndUpdate(
    filter,
    {
      $push: {
        errors: err,
      },
      $set: {
        updated_at: new Date(),
      },
    },
    { returnDocument: "after" }
  );
}

export async function markEmailAsDelivered(messageId: string) {
  const now = new Date();
  await getDbCollection("events").findOneAndUpdate(
    { messageId },
    {
      $set: {
        delivered_at: now,
        updated_at: now,
      },
    }
  );
}

export async function markEmailAsFailed(messageId: string, type: IEmailError["type"]) {
  return addEmailError({ messageId }, { type });
}

export async function markEmailAsOpened(id: ObjectId) {
  const now = new Date();
  await getDbCollection("events").findOneAndUpdate(
    { _id: id },
    {
      $set: {
        opened_at: now,
        updated_at: now,
      },
    }
  );
}

export async function unsubscribe(email: string) {
  const now = new Date();

  await getDbCollection("emailDenied").findOneAndUpdate(
    {
      email,
    },
    {
      $set: {
        reason: "unsubscribe",
        updated_at: now,
      },
      $setOnInsert: {
        email,
        created_at: now,
      },
    }
  );
}

export async function isUnsubscribed(email: string): Promise<boolean> {
  const denied = await getDbCollection("emailDenied").findOne(
    {
      email,
    },
    { projection: { _id: 0, email: 1 } }
  );

  return denied !== null;
}
