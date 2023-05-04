import { Filter, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { IUser } from "shared/models/user.model";

import { generateKey, generateSecretHash } from "../../utils/cryptoUtils";
import { createUserTokenSimple } from "../../utils/jwtUtils";
import { getDbCollection } from "../../utils/mongodb";
import { hashPassword } from "../server/utils/password.utils";
import { createPerson } from "./persons.actions";

type ICreateUser = {
  email: string;
  password: string;
  organisation_id: string;
  is_admin?: boolean;
};

export const createUser = async ({ organisation_id, ...data }: ICreateUser) => {
  const person = await createPerson({
    email: data.email,
    organisation_id,
    _meta: { source: "bal" },
  });
  if (!person) {
    throw new Error("Can't create person");
  }

  const _id = new ObjectId();

  const password = hashPassword(data.password);

  const { insertedId: userId } = await getDbCollection("users").insertOne({
    ...data,
    person_id: person._id,
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