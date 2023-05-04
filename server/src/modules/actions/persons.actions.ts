import { Filter, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { IPerson } from "shared/models/person.model";

import { getDbCollection } from "../../utils/mongodb";

type ICreatePerson = {
  email: string;
  organisation_id: string;
  _meta: unknown;
};

export const createPerson = async (data: ICreatePerson) => {
  const _id = new ObjectId();

  const { insertedId: personId } = await getDbCollection("persons").insertOne({
    ...data,
    _id,
  });

  const person = await findPerson({ _id: personId });

  return person;
};

export const findPerson = async (
  filter: Filter<IPerson>,
  options?: FindOptions
) => {
  const person = await getDbCollection("persons").findOne<IPerson>(
    filter,
    options
  );

  return person;
};

export const updatePerson = async (
  person: IPerson,
  data: Partial<IPerson>,
  updateFilter: UpdateFilter<IPerson> = {}
) => {
  return await getDbCollection("persons").findOneAndUpdate(
    {
      _id: person._id,
    },
    {
      $set: data,
      ...updateFilter,
    }
  );
};
