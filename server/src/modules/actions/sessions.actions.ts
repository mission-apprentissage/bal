import { Filter, FindOptions } from "mongodb";
import { ISession } from "shared/models/session.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type TCreateSession = Omit<ISession, "id">;

export const createSession = async (data: TCreateSession) => {
  const { insertedId: _id } = await getDbCollection("sessions").insertOne(data);

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
