import { Filter, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { IUser } from "shared/models/user.model";

import { generateKey, generateSecretHash } from "../../utils/cryptoUtils";
import { createUserTokenSimple } from "../../utils/jwtUtils";
import { getDbCollection } from "../../utils/mongodb";
import { hashPassword } from "../server/utils/password.utils";

type ICreateUser = {
  email: string;
  password: string;
  is_admin?: boolean;
};

export const createUser = async (data: ICreateUser) => {
  const _id = new ObjectId();

  const password = hashPassword(data.password);

  const { insertedId: userId } = await getDbCollection("users").insertOne({
    ...data,
    _id,
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

export const updateUser = async (
  user: IUser,
  data: Partial<IUser>,
  updateFilter: UpdateFilter<IUser> = {}
) => {
  return await getDbCollection("users").findOneAndUpdate(
    {
      _id: user._id,
    },
    {
      $set: data,
      ...updateFilter,
    }
  );
};

export const generateApiKey = async (user: IUser) => {
  const generatedKey = generateKey();
  const secretHash = generateSecretHash(generatedKey);

  await updateUser(
    user,
    { api_key: secretHash },
    { $unset: { api_key_used_at: true } }
  );

  const token = createUserTokenSimple({
    payload: { _id: user._id, api_key: generatedKey },
  });

  return token;
};
