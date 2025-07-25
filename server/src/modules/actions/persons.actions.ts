import type { Filter, UpdateFilter } from "mongodb";
import { ObjectId } from "mongodb";
import type { IPerson, PersonWithOrganisation } from "shared/models/person.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type ICreatePerson = {
  email: string;
  organisations: string[];
  _meta: { [x: string]: unknown };
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
  const now = new Date();
  const person: IPerson = {
    _id: new ObjectId(),
    ...data,
    updated_at: now,
    created_at: now,
  };

  await getDbCollection("persons").insertOne(person);

  return person;
};

export const findPerson = async (filter: Filter<IPerson>): Promise<PersonWithOrganisation | null> => {
  const person = await getDbCollection("persons")
    .aggregate<PersonWithOrganisation>([
      {
        $match: filter,
      },
      {
        $limit: 1,
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

export const findPersons = async (filter: Filter<IPerson> | null): Promise<PersonWithOrganisation[]> => {
  const pipeline = [
    {
      $lookup: DEFAULT_LOOKUP,
    },
    {
      $unwind: DEFAULT_UNWIND,
    },
  ];
  const persons = await getDbCollection("persons")
    .aggregate<PersonWithOrganisation>(
      filter
        ? [
            {
              $match: filter,
            },
            ...pipeline,
          ]
        : pipeline
    )
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
      $set: { ...data, updated_at: new Date() },
      ...updateFilter,
    }
  );
};
