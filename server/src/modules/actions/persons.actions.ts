import { Filter, ObjectId, UpdateFilter } from "mongodb";
import { IPerson } from "shared/models/person.model";

import { getDbCollection } from "@/utils/mongodbUtils";

type ICreatePerson = {
  email: string;
  organisation_id: string;
  _meta: unknown;
};

const DEFAULT_LOOKUP = {
  from: "organisations",
  let: { organisationId: { $toObjectId: "$organisation_id" } },
  pipeline: [
    {
      $match: {
        $expr: { $eq: ["$_id", "$$organisationId"] },
      },
    },
  ],
  as: "organisation",
};

const DEFAULT_UNWIND = {
  path: "$organisation",
  preserveNullAndEmptyArrays: true,
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

export const findPerson = async (filter: Filter<IPerson>) => {
  const person = await getDbCollection("persons")
    .aggregate<IPerson>([
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

  return person;
};

export const findPersons = async (filter: Filter<IPerson>) => {
  const persons = await getDbCollection("persons")
    .aggregate<IPerson>([
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

  return persons;
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
