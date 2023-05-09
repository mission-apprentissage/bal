import { Filter, FindOptions, ObjectId, UpdateFilter } from "mongodb";
import { IOrganisation } from "shared/models/organisation.model";
import { IResOrganisationValidation } from "shared/routes/v1/organisation.routes";

import { getDbCollection } from "../../utils/mongodb";
import { getAktoVerification } from "../apis/akto";
import { getOpcoEpVerification } from "../apis/opcoEp";
import { getDecaVerification } from "./deca.actions";

// TODO WIP
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
  if (testOpcoEp.codeRetour === 1) {
    return {
      is_valid: true,
      on: "email",
    };
  }
  if (testOpcoEp.codeRetour === 2) {
    return {
      is_valid: true,
      on: "domain",
    };
  }
  //   1-	SIRET et courriel connus
  // {
  //     "codeRetour": 1,
  //     "detailRetour": "Email trouvé"
  // }

  // 2-	SIRET connu et domaine courriel connu
  // {
  //     "codeRetour": 2,
  //     "detailRetour": "Domaine identique"
  // }

  // 3-	SIRET connu et domaine courriel inconnu
  // {
  //     "codeRetour": 3,
  //     "detailRetour": "Email ou domaine inconnu"
  // }

  // 4-	SIRET inconnu
  // {
  //     "codeRetour": 4,
  //     "detailRetour": "Siret inconnu"
  // }

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
  ).findOne<IOrganisation>(
    { "organisation.etablissements.siret": siret },
    options
  );

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
