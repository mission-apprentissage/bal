import { getSirenFromSiret } from "shared/helpers/common";
import type { IResponse, IPostRoutes } from "shared";
import { getAktoVerification } from "../../common/apis/akto";
import {
  getOpcoEpVerification,
  OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE,
  OPCO_EP_CODE_RETOUR_EMAIL_TROUVE,
} from "../../common/apis/opcoEp";
import { updateOrganisationAndPerson } from "./organisations.actions";
import { getCatalogueEmailVerification } from "./catalogue.actions";
import { getDbVerification } from "./deca.actions";
import { getLbaAlgoEmailVerification } from "./lba.algo.siret.email.actions";

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

  const testCatalogue = await getCatalogueEmailVerification(siret, email);
  if (testCatalogue.is_valid) {
    return testCatalogue;
  }

  const testLbaAlgo = await getLbaAlgoEmailVerification(siret, email);
  if (testLbaAlgo.is_valid) {
    return testLbaAlgo;
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
