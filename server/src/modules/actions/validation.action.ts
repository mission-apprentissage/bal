import { getSirenFromSiret } from "shared/helpers/common";
import type { IResponse, IPostRoutes } from "shared";
import { getAktoVerification } from "../../common/apis/akto";
import {
  getOpcoEpVerification,
  OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE,
  OPCO_EP_CODE_RETOUR_EMAIL_TROUVE,
} from "../../common/apis/opcoEp";
import { importOrganisation } from "./organisations.actions";
import { getDbVerification } from "./deca.actions";
import { importPerson } from "./persons.actions";

export const validation = async ({
  email,
  siret,
}: {
  email: string;
  siret: string;
}): Promise<IResponse<IPostRoutes["/v1/organisation/validation"]>> => {
  const testDb = await getDbVerification(siret, email);
  if (testDb.is_valid) {
    return testDb;
  }

  const siren = getSirenFromSiret(siret);
  const testAkto = await getAktoVerification(siren, email);
  if (testAkto) {
    await importPerson({
      email,
      siret,
      source: "AKTO",
    });

    return {
      is_valid: true,
      on: "email",
    };
  }

  const testOpcoEp = await getOpcoEpVerification(siret, email);
  if (testOpcoEp.codeRetour === OPCO_EP_CODE_RETOUR_EMAIL_TROUVE) {
    await importPerson({
      email,
      siret,
      source: "AKTO",
    });

    return {
      is_valid: true,
      on: "email",
    };
  }

  if (testOpcoEp.codeRetour === OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE) {
    await importOrganisation({
      email,
      siret,
      source: "OPCO_EP",
    });

    return {
      is_valid: true,
      on: "domain",
    };
  }

  return testDb;
};
