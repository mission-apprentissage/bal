import companyEmailValidator from "company-email-validator";
import { ObjectId } from "mongodb";
import type { Filter, FindOptions } from "mongodb";
import { getSirenFromSiret } from "shared/helpers/common";
import type { IOrganisation } from "shared/models/organisation.model";
import { z } from "zod/v4-mini";

import { getDbCollection } from "@/common/utils/mongodbUtils";

type IImportOrganisation = {
  email: unknown;
  source: string;
  siret: unknown;
};

export const findOrganisations = async (filter: Filter<IOrganisation> | null) => {
  const organisations = await getDbCollection("organisations")
    .find(filter ?? {})
    .toArray();

  return organisations;
};

export const findOrganisation = async (filter: Filter<IOrganisation>, options?: FindOptions) => {
  const organisation = await getDbCollection("organisations").findOne<IOrganisation>(filter, options);

  return organisation;
};

export async function importOrganisation(data: IImportOrganisation): Promise<boolean> {
  const now = new Date();

  const emailParsed = z.email().safeParse(data.email);
  if (!emailParsed.success) {
    return false;
  }

  const [_, domain] = emailParsed.data.split("@");

  // TODO: parse siret
  const siretParsed = z.string().safeParse(data.siret);

  if (!siretParsed.success) {
    return false;
  }

  const siren = getSirenFromSiret(siretParsed.data);

  const isCompanyDomain = companyEmailValidator.isCompanyDomain(domain);

  if (!isCompanyDomain) {
    return false;
  }

  const defaultOrganisation: Omit<IOrganisation, "siren" | "updated_at"> = {
    _id: new ObjectId(),
    etablissements: [{ siret: siretParsed.data }],
    email_domains: [domain.toLowerCase()],
    _meta: { sources: [data.source] },
    created_at: now,
  };

  // TODO: remove non-company domain
  await getDbCollection("organisations").updateOne(
    { siren },
    {
      $setOnInsert: defaultOrganisation,
      $set: { updated_at: now },
      $addToSet: {
        etablissements: { siret: siretParsed.data },
        email_domains: domain.toLowerCase(),
        "_meta.sources": data.source,
      },
    },
    {
      upsert: true,
    }
  );

  await getDbCollection("organisations").updateOne(
    { siren },
    {
      $addToSet: {
        etablissements: { siret: siretParsed.data },
        email_domains: domain.toLowerCase(),
        "_meta.sources": data.source,
      },
    },
    {
      upsert: true,
    }
  );

  return true;
}

export const updateOrganisation = async (organisation: IOrganisation, data: Partial<IOrganisation>) => {
  if (Object.keys(data).length === 0) {
    return organisation;
  }

  return await getDbCollection("organisations").findOneAndUpdate(
    {
      _id: organisation._id,
    },
    {
      $set: { ...data, updated_at: new Date() },
    },
    { returnDocument: "after" }
  );
};
