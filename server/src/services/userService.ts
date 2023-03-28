import { ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";
import { IReqPostUser } from "shared/routes/user.routes";

import { getDbCollection } from "../db/mongodb";
import { server } from "../server";

export const createUser = async (data: IReqPostUser): Promise<IUser | null> => {
  const _id = new ObjectId();
  const token = server.jwt.sign({
    email: data.email,
    userId: _id,
  });

  const { insertedId: userId } = await getDbCollection("users").insertOne({
    ...data,
    _id,
    token,
  });

  const user = await getDbCollection("users").findOne<IUser>({
    _id: userId,
  });

  return user;
};
