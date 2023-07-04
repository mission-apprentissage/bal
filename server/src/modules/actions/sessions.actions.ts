import { Filter, FindOptions } from "mongodb";
import { ISession } from "shared/models/session.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type TCreateSession = Omit<ISession, "id">;

export const createSession = async (data: TCreateSession) => {
  const { insertedId: _id } = await getDbCollection("sessions").insertOne({
    ...data,
    updated_at: new Date(),
    created_at: new Date(),
  });

  const session = await getSession({ _id });

  return session;
};

export const getSession = async (
  filter: Filter<ISession>,
  options?: FindOptions
) => {
  return await getDbCollection("sessions").findOne<ISession>(filter, options);
};

export const deleteSession = async (session: ISession) => {
  await getDbCollection("sessions").deleteMany(session);
};

export const updateSession = async (_id: string, data: Partial<ISession>) => {
  return getDbCollection("sessions").updateOne(
    { _id },
    { $set: { ...data, updated_at: new Date() } }
  );
};
