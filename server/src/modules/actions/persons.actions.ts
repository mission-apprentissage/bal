import { Filter, UpdateFilter, WithoutId } from "mongodb";
import { IOrganisationDocument } from "shared/models/organisation.model";
import { IPerson, IPersonDocument } from "shared/models/person.model";

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

interface PersonWithOrganisation extends IPersonDocument {
  organisation: null | IOrganisationDocument;
}

export const createPerson = async (data: ICreatePerson) => {
  const now = new Date();
  const person: WithoutId<IPersonDocument> = {
    ...data,
    updated_at: now,
    created_at: now,
  };
  const { insertedId: personId } = await getDbCollection("persons").insertOne(
    person
  );

  return {
    ...person,
    _id: personId,
  };
};

export const findPerson = async (
  filter: Filter<IPersonDocument>
): Promise<PersonWithOrganisation | null> => {
  const person = await getDbCollection("persons")
    .aggregate<PersonWithOrganisation>([
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

export const findPersons = async (
  filter: Filter<IPerson>
): Promise<PersonWithOrganisation[]> => {
  const persons = await getDbCollection("persons")
    .aggregate<PersonWithOrganisation>([
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
  person: IPersonDocument,
  data: Partial<IPersonDocument>,
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
