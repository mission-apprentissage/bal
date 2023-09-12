import { internal } from "@hapi/boom";
import { Filter, FindOptions } from "mongodb";
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
import { getDecaVerification } from "./deca.actions";

export const validation = async ({
  email,
  siret,
}: {
  email: string;
  siret: string;
}): Promise<IResponse<IPostRoutes["/v1/organisation/validation"]>> => {
  const testDeca = await getDecaVerification(siret, email);

  if (testDeca.is_valid) {
    return testDeca;
  }

  const siren = getSirenFromSiret(siret);
  const testAkto = await getAktoVerification(siren, email);
  if (testAkto) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  const testOpcoEp = await getOpcoEpVerification(siret, email);
  if (testOpcoEp.codeRetour === OPCO_EP_CODE_RETOUR_EMAIL_TROUVE) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  if (testOpcoEp.codeRetour === OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE) {
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
    ...data,
    updated_at: now,
    created_at: now,
  };
  const { insertedId: organisationId } = await getDbCollection("organisations").insertOne({
    ...data,
    updated_at: now,
    created_at: now,
  });

  return {
    ...organisation,
    _id: organisationId,
  };
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
