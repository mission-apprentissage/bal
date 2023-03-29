import { Filter, ObjectId } from "mongodb";
import { IUser } from "shared/models/user.model";
import { IReqPostUser } from "shared/routes/user.routes";

import { createUserToken } from "../../utils/jwtUtils";
import { getDbCollection } from "../../utils/mongodb";

export const createUser = async (data: IReqPostUser): Promise<IUser | null> => {
  const _id = new ObjectId();
  const token = createUserToken({ ...data, _id: _id.toString() });

  const { insertedId: userId } = await getDbCollection("users").insertOne({
    ...data,
    _id,
    token,
  });

  const user = await findUser({ _id: userId });

  return user;
};

export const findUser = async (
  filter: Filter<IUser>
): Promise<IUser | null> => {
  const user = await getDbCollection("users").findOne<IUser>(filter);

  return user;
};
