import { internal } from "@hapi/boom";
import companyEmailValidator from "company-email-validator";
import { Filter, FindOptions, ObjectId } from "mongodb";
import { IPostRoutes, IResponse } from "shared";
import { getSirenFromSiret } from "shared/helpers/common";
import { IOrganisation } from "shared/models/organisation.model";

import { getDbCollection } from "@/common/utils/mongodbUtils";

import { getAktoVerification } from "../../common/apis/akto";
import {
  getOpcoEpVerification,
  OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE,
  OPCO_EP_CODE_RETOUR_EMAIL_TROUVE,
} from "../../common/apis/opcoEp";
import { getDbVerification } from "./deca.actions";

export const validation = async ({
  email,
  siret,
}: {
  email: string;
  siret: string;
}): Promise<IResponse<IPostRoutes["/v1/organisation/validation"]>> => {
  const testDeca = await getDbVerification(siret, email);

  if (testDeca.is_valid) {
    return testDeca;
  }

  const siren = getSirenFromSiret(siret);
  const testAkto = await getAktoVerification(siren, email);
  if (testAkto) {
    await updateOrganisationAndPerson(siret, email, "AKTO");
    return {
      is_valid: true,
      on: "email",
    };
  }

  const testOpcoEp = await getOpcoEpVerification(siret, email);
  if (testOpcoEp.codeRetour === OPCO_EP_CODE_RETOUR_EMAIL_TROUVE) {
    await updateOrganisationAndPerson(siret, email, "OPCO_EP");
    return {
      is_valid: true,
      on: "email",
    };
  }

  if (testOpcoEp.codeRetour === OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE) {
    await updateOrganisationAndPerson(siret, email, "OPCO_EP");
    return {
      is_valid: true,
      on: "domain",
    };
  }

  return {
    is_valid: false,
  };
};

interface ICreateOrganisation extends Omit<IOrganisation, "_id"> {}
export const createOrganisation = async (data: ICreateOrganisation): Promise<IOrganisation> => {
  const now = new Date();
  const organisation = {
    _id: new ObjectId(),
    ...data,
    updated_at: now,
    created_at: now,
  };

  await getDbCollection("organisations").insertOne(organisation);

  return organisation;
};

export const findOrganisations = async (filter: Filter<IOrganisation> = {}) => {
  const organisations = await getDbCollection("organisations").find(filter).toArray();

  return organisations;
};

export const findOrganisation = async (filter: Filter<IOrganisation>, options?: FindOptions) => {
  const organisation = await getDbCollection("organisations").findOne<IOrganisation>(filter, options);

  return organisation;
};

export const findOrCreateOrganisation = async (
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

export const findOrganisationBySiret = async (siret: string, options?: FindOptions) => {
  const organisation = await getDbCollection("organisations").findOne<IOrganisation>(
    { "etablissements.siret": siret },
    options
  );

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

export const updateOrganisationAndPerson = async (siret: string, courriel: string, source: string) => {
  const siren = getSirenFromSiret(siret);

  if (!courriel.split("@")[1]) return;
  const domain = courriel.split("@")[1].toLowerCase();

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
      $addToSet: {
        ...(organisation && { organisations: organisation._id.toString() }),
        sirets: siret,
      },
      $setOnInsert: {
        email: courriel,
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
    (domain) => !organisation.email_domains?.includes(domain) && companyEmailValidator.isCompanyDomain(domain)
  );

  if (newDomains.length) {
    updateOrganisationData.email_domains = organisation.email_domains ?? [];
    updateOrganisationData.email_domains?.push(...newDomains);
  }

  await updateOrganisation(organisation, updateOrganisationData);

  return findOrganisation({ _id: organisation._id });
};
