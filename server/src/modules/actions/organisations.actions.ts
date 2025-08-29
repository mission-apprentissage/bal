import dns from "node:dns";

import util from "util";
import { internal } from "@hapi/boom";
import companyEmailValidator from "company-email-validator";
import type { Filter, FindOptions } from "mongodb";
import { getSirenFromSiret } from "shared/helpers/common";
import type { IOrganisation } from "shared/models/organisation.model";
import { z } from "zod/v4-mini";

const dnsLookup = util.promisify(dns.lookup);

import { getDbCollection } from "@/common/utils/mongodbUtils";

type ICreateOrganisation = Omit<IOrganisation, "_id">;

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

const findOrCreateOrganisation = async (
  filter: Filter<IOrganisation>,
  data: ICreateOrganisation
): Promise<IOrganisation> => {
  const now = new Date();
  const organisation = await getDbCollection("organisations").findOneAndUpdate(
    filter,
    {
      $setOnInsert: {
        ...data,
        updated_at: now,
        created_at: now,
      },
    },
    { returnDocument: "after", upsert: true, includeResultMetadata: false }
  );

  if (organisation === null) {
    throw internal("fail to create organisation");
  }

  return organisation;
};

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

export const updateOrganisationAndPerson = async (
  siret: string,
  argCourriel: string,
  source: string,
  dns_lookup = false,
  content?: { nom: string; prenom: string }
) => {
  const siren = getSirenFromSiret(siret);

  const courrielParsed = z.email().safeParse(argCourriel);
  if (!courrielParsed.success) return;

  const courriel = courrielParsed.data;

  if (!courriel.split("@")[1]) return;

  let domain = courriel.split("@")[1].toLowerCase();

  if (dns_lookup) {
    // TODO: Check company domain validity
    try {
      await dnsLookup(domain);
    } catch (_error) {
      domain = "";
    }
  }
  const organisation = await updateOrganisationData({
    siren,
    sirets: [siret],
    email_domains: [domain],
    source,
  });

  await getDbCollection("persons").updateOne(
    {
      email: courriel,
    },
    {
      $set: {
        updated_at: new Date(),
      },
      $addToSet: {
        ...(organisation && { organisations: organisation._id.toString() }),
        sirets: siret,
      },
      $setOnInsert: {
        email: courriel,
        ...(content?.nom && {
          nom: content?.nom,
        }),
        ...(content?.prenom && {
          prenom: content?.prenom,
        }),
        created_at: new Date(),
      },
    },
    {
      upsert: true,
    }
  );
};

interface IUpdateOrganisationData {
  siren: string;
  sirets: string[];
  email_domains: string[];
  source: string;
}

export const updateOrganisationData = async ({ siren, sirets, email_domains, source }: IUpdateOrganisationData) => {
  const organisation = await findOrCreateOrganisation(
    { siren },
    {
      siren,
      etablissements: sirets.map((siret) => ({ siret })),
    }
  );

  const sources = organisation._meta?.sources ?? [];
  const newSources = [...new Set([...sources, source])];

  const updateOrganisationData: Partial<IOrganisation> = {
    etablissements: organisation.etablissements ?? [],
    email_domains: organisation.email_domains ?? [],
    _meta: { sources: newSources },
  };

  for (const siret of sirets) {
    const etablissement = updateOrganisationData.etablissements?.find((e) => e.siret === siret);

    if (!etablissement) {
      updateOrganisationData.etablissements?.push({ siret });
    }
  }

  const newDomains = email_domains.filter(
    (domain) =>
      !organisation.email_domains?.includes(domain) && companyEmailValidator.isCompanyDomain(domain) && domain !== ""
  );

  if (newDomains.length) {
    updateOrganisationData.email_domains = organisation.email_domains ?? [];
    updateOrganisationData.email_domains?.push(...newDomains);
  }

  await updateOrganisation(organisation, updateOrganisationData);

  return findOrganisation({ _id: organisation._id });
};
