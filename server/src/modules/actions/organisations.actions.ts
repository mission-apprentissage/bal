import { Filter, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { IOrganisation } from "shared/models/organisation.model";
import { IResOrganisationValidation } from "shared/routes/v1/organisation.routes";

import { getDbCollection } from "@/utils/mongodbUtils";

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
}): Promise<IResOrganisationValidation> => {
  const testDeca = await getDecaVerification(siret, email);

  if (testDeca.is_valid) {
    return testDeca;
  }

  const siren = siret.substring(0, 9);
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
export const createOrganisation = async (data: ICreateOrganisation) => {
  const _id = new ObjectId();

  const { insertedId: organisationId } = await getDbCollection(
    "organisations"
  ).insertOne({
    ...data,
    _id,
  });

  return organisationId;
};

export const findOrganisations = async (filter: Filter<IOrganisation> = {}) => {
  const organisations = await getDbCollection("organisations")
    .aggregate<IOrganisation>([
      {
        $match: filter,
      },
    ])
    .toArray();

  return organisations;
};

export const findOrganisation = async (
  filter: Filter<IOrganisation>,
  options?: FindOptions
) => {
  const organisation = await getDbCollection(
    "organisations"
  ).findOne<IOrganisation>(filter, options);

  return organisation;
};

export const findOrganisationBySiret = async (
  siret: string,
  options?: FindOptions
) => {
  const organisation = await getDbCollection(
    "organisations"
  ).findOne<IOrganisation>({ "etablissements.siret": siret }, options);

  return organisation;
};

export const updatePerson = async (
  organisation: IOrganisation,
  data: Partial<IOrganisation>,
  updateFilter: UpdateFilter<IOrganisation> = {}
) => {
  return await getDbCollection("organisations").findOneAndUpdate(
    {
      _id: organisation._id,
    },
    {
      $set: data,
      ...updateFilter,
    }
  );
};
