import type { Filter, UpdateFilter } from "mongodb";
import { ObjectId } from "mongodb";
import type { IUser } from "shared/models/user.model";

import { generateKey, generateSecretHash } from "../../common/utils/cryptoUtils";
import { createUserTokenSimple } from "../../common/utils/jwtUtils";
import { hashPassword } from "../server/utils/password.utils";
import { createPerson } from "./persons.actions";
import { getDbCollection } from "@/common/utils/mongodbUtils";

type ICreateUser = {
  email: string;
  password: string;
  organisation_id: string;
  is_admin?: boolean;
  is_support?: boolean;
};

export const createUser = async ({ organisation_id, ...data }: ICreateUser) => {
  const person = await createPerson({
    email: data.email,
    organisations: [organisation_id],
    _meta: { source: "bal" },
  });

  const _id = new ObjectId();

  const password = hashPassword(data.password);
  const now = new Date();
  const user: IUser = {
    is_admin: false,
    is_support: false,
    api_key: null,
    api_key_used_at: null,
    ...data,
    _id,
    password,
    updated_at: now,
    created_at: now,
  };
  const { insertedId: userId } = await getDbCollection("users").insertOne(user);

  return {
    ...user,
    person,
    _id: userId,
  };
};

export const findUsers = async (filter: Filter<IUser>): Promise<IUser[]> => {
  const users = await getDbCollection("users").find(filter).toArray();

  return users;
};

export const findUser = async (filter: Filter<IUser>): Promise<IUser | null> => {
  const user = await getDbCollection("users").findOne(filter);

  return user;
};

export const updateUser = async (
  email: IUser["email"],
  data: Partial<IUser>,
  updateFilter: UpdateFilter<IUser> = {}
): Promise<void> => {
  await getDbCollection("users").findOneAndUpdate(
    {
      email,
    },
    {
      $set: { ...data, updated_at: new Date() },
      ...updateFilter,
    }
  );
};

export const deleteUser = async (id: ObjectId): Promise<void> => {
  await getDbCollection("users").deleteOne({
    _id: id,
  });
};

export const generateApiKey = async (user: IUser) => {
  const generatedKey = generateKey();
  const secretHash = generateSecretHash(generatedKey);

  await updateUser(user.email, { api_key: secretHash }, { $unset: { api_key_used_at: true } });

  const token = createUserTokenSimple({
    payload: { _id: user._id, api_key: generatedKey },
    expiresIn: "365d",
  });

  return token;
};
