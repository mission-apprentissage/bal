import { Filter, FindOptions, ObjectId } from "mongodb";
import { ISession } from "shared/models/session.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type TCreateSession = Pick<ISession, "token">;

export const createSession = async (data: TCreateSession) => {
  const now = new Date();
  const { insertedId: _id } = await getDbCollection("sessions").insertOne({
    ...data,
    updated_at: now,
    created_at: now,
  });

  const session = await getSession({ _id });

  return session;
};

export const getSession = async (filter: Filter<ISession>, options?: FindOptions): Promise<ISession | null> => {
  return await getDbCollection("sessions").findOne(filter, options);
};

export const deleteSession = async (token: string) => {
  await getDbCollection("sessions").deleteMany({ token });
};

export const updateSession = async (_id: ObjectId, data: Partial<ISession>) => {
  return getDbCollection("sessions").updateOne({ _id }, { $set: { ...data, updated_at: new Date() } });
};
