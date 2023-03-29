import { ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";
import { IReqPostUser } from "shared/routes/user.routes";

import { getDbCollection } from "../../utils/mongodb";



interface ICreateUserData extends IReqPostUser {
  _id?: ObjectId;
  token: string;
}

export const createUser = async (
  data: ICreateUserData
): Promise<IUser | null> => {

  // TODO createToken
  const { insertedId: userId } = await getDbCollection("users").insertOne(data);

  const user = await getDbCollection("users").findOne<IUser>({
    _id: userId,
  });

  return user;
};


export const findUser = async (
  email: string
): Promise<IUser | null> => {
  return await getDbCollection("users").findOne<IUser>({
    email,
  });
}
