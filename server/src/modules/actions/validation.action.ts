import { getSirenFromSiret } from "shared/helpers/common";
import type { IResponse, IPostRoutes } from "shared";
import { isCompanyEmail } from "company-email-validator";
import { getAktoVerification } from "../../common/apis/akto";
import {
  getOpcoEpVerification,
  OPCO_EP_CODE_RETOUR_DOMAINE_IDENTIQUE,
  OPCO_EP_CODE_RETOUR_EMAIL_TROUVE,
} from "../../common/apis/opcoEp";
import { getDbCollection } from "../../common/utils/mongodbUtils";
import { importOrganisation } from "./organisations.actions";
import { importPerson } from "./persons.actions";

async function getDbVerification(
  siret: string,
  rawEmail: string
): Promise<IResponse<IPostRoutes["/v1/organisation/validation"]>> {
  // TODO: parse email
  const email = rawEmail.toLowerCase();
  const [_user, domain] = email.split("@");
  const siren = getSirenFromSiret(siret);

  // check siren / email
  const personsFromEmail = await getDbCollection("persons")
    .find({
      email: email,
      siret: { $regex: `^${siren}` },
    })
    .toArray();

  if (personsFromEmail.length > 0) {
    const sources = personsFromEmail.map((p) => p.source);

    return {
      is_valid: true,
      on: "email",
      sources: Array.from(new Set(sources)),
    };
  }

  // check siren / domain
  if (isCompanyEmail(email)) {
    const organisationsFromDomain = await getDbCollection("organisations")
      .find({
        email_domain: domain,
        siren,
      })
      .toArray();

    if (organisationsFromDomain.length > 0) {
      const sources = personsFromEmail.map((p) => p.source);
      return {
        is_valid: true,
        on: "domain",
        sources: Array.from(new Set(sources)),
      };
    }

    return { is_valid: false, is_company_email: true };
  }

  return { is_valid: false, is_company_email: false };
}

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
    const data = { email, siret, source: "AKTO" };
    await Promise.all([importPerson(data), importOrganisation(data)]);

    return {
      is_valid: true,
      on: "email",
      sources: ["AKTO"],
    };
  }

  const testOpcoEp = await getOpcoEpVerification(siret, email);
  if (testOpcoEp.codeRetour === OPCO_EP_CODE_RETOUR_EMAIL_TROUVE) {
    const data = {
      email,
      siret,
      source: "OPCO_EP",
    };
    await Promise.all([importPerson(data), importOrganisation(data)]);

    return {
      is_valid: true,
      on: "email",
      sources: ["OPCO_EP"],
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
      sources: ["OPCO_EP"],
    };
  }

  return testDb;
};
