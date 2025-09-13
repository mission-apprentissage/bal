import type { Filter } from "mongodb";
import { ObjectId } from "mongodb";
import type { IPerson, PersonWithOrganisation } from "shared/models/person.model";

import { z } from "zod/v4-mini";
import { importOrganisation } from "./organisations.actions";
import { getDbCollection } from "@/common/utils/mongodbUtils";

type ICreatePerson = {
  email: string;
  organisations: string[];
  _meta: { [x: string]: unknown };
};

type IImportPerson = {
  email: unknown;
  source: string;
  siret: unknown;
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
  const [_, emailDomain] = data.email.split("@");
  const person: IPerson = {
    _id: new ObjectId(),
    email_domain: emailDomain.toLowerCase(),
    nom: null,
    prenom: null,
    sirets: [],
    ...data,
    _meta: { sources: [], ...data._meta },
    updated_at: now,
    created_at: now,
  };

  await getDbCollection("persons").insertOne(person);

  return person;
};

export const importPerson = async (data: IImportPerson): Promise<boolean> => {
  const now = new Date();

  const emailParsed = z.email().safeParse(data.email);
  if (!emailParsed.success) {
    return false;
  }

  const [_, emailDomain] = emailParsed.data.split("@");

  const defaultPerson: Omit<IPerson, "email" | "updated_at"> = {
    _id: new ObjectId(),
    email_domain: emailDomain.toLowerCase(),
    nom: null,
    prenom: null,
    sirets: [],
    _meta: { sources: [data.source] },
    organisations: [],
    created_at: now,
  };

  await getDbCollection("persons").updateOne(
    { email: emailParsed.data.toLowerCase() },
    {
      $set: { updated_at: now },
      $setOnInsert: defaultPerson,
    },
    { upsert: true }
  );

  await getDbCollection("persons").updateOne(
    { email: emailParsed.data.toLowerCase() },
    {
      $set: { updated_at: now },
      $addToSet: { "_meta.sources": data.source },
    }
  );

  // TODO: parse siret
  const siretParsed = z.string().safeParse(data.siret);
  if (siretParsed.success) {
    await getDbCollection("persons").updateOne(
      { email: emailParsed.data.toLowerCase() },
      {
        $addToSet: { sirets: siretParsed.data },
        $set: { updated_at: now },
      }
    );
  }

  await importOrganisation({
    email: data.email,
    siret: siretParsed.data,
    source: "OPCO_EP",
  });

  return true;
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
