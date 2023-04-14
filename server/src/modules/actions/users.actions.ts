import { Filter, FindOptions, ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";

import { createUserToken } from "../../utils/jwtUtils";
import { getDbCollection } from "../../utils/mongodb";
import { hashPassword } from "../server/utils/password.utils";

export const createUser = async (data: IUser) => {
  const _id = new ObjectId();
  const token = createUserToken({ ...data, _id: _id.toString() });

  const password = hashPassword(data.password);

  const { insertedId: userId } = await getDbCollection("users").insertOne({
    ...data,
    _id,
    token,
    password,
  });

  const user = await findUser({ _id: userId });

  return user;
};

export const findUser = async (
  filter: Filter<IUser>,
  options?: FindOptions
) => {
  const user = await getDbCollection("users").findOne<IUser>(filter, options);

  return user;
};

export const updateUser = async (user: IUser, data: Partial<IUser>) => {
  return await getDbCollection("users").findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: data,
    }
  );
};
