import { Filter, ObjectId, UpdateFilter } from "mongodb";
import { IUser, IUserWithPerson } from "shared/models/user.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

import { generateKey, generateSecretHash } from "../../common/utils/cryptoUtils";
import { createUserTokenSimple } from "../../common/utils/jwtUtils";
import { hashPassword } from "../server/utils/password.utils";
import { createPerson } from "./persons.actions";

type ICreateUser = {
  email: string;
  password: string;
  organisation_id: string;
  is_admin?: boolean;
};

const DEFAULT_LOOKUP = {
  from: "persons",
  let: { personId: { $toObjectId: "$person_id" } },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ["$_id", "$$personId"] },
      },
    },
  ],
  as: "person",
};

const DEFAULT_UNWIND = {
  path: "$person",
  preserveNullAndEmptyArrays: true,
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
  const user = {
    ...data,
    person_id: person._id.toString(),
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

export const findUsers = async (filter: Filter<IUser>): Promise<IUserWithPerson[]> => {
  const users = await getDbCollection("users")
    .aggregate<IUserWithPerson>([
      {
        $match: filter,
      },
      {
        $lookup: DEFAULT_LOOKUP,
      },
      {
        $unwind: DEFAULT_UNWIND,
      },
    ])
    .toArray();

  return users;
};

export const findUser = async (filter: Filter<IUser>): Promise<IUserWithPerson | null> => {
  const user = await getDbCollection("users")
    .aggregate<IUserWithPerson>([
      {
        $match: filter,
      },
      {
        $lookup: DEFAULT_LOOKUP,
      },
      {
        $unwind: DEFAULT_UNWIND,
      },
    ])
    .next();

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
