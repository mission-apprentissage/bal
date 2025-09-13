import companyEmailValidator from "company-email-validator";
import type { IPostRoutes, IResponse } from "shared";
import { SIRET_REGEX } from "shared/constants/regex";
import { getSirenFromSiret } from "shared/helpers/common";

import { getDbCollection } from "../../common/utils/mongodbUtils";
import { findPerson, importPerson } from "./persons.actions";

interface ContentLine {
  SIRET: string;
  EMAIL?: string;
}

export interface DECAParsedContentLine {
  siret: string;
  emails: string[];
}

export const parseContentLine = (line: ContentLine): DECAParsedContentLine | undefined => {
  if (!line.EMAIL) return;
  if (!SIRET_REGEX.test(line.SIRET)) return;

  const { SIRET: siret } = line;

  // remove {}
  const cleanedEmailLine = line.EMAIL?.replace(/[{}]/g, "") ?? "";
  // split emails and remove non valid emails
  let emails = cleanedEmailLine.split(",").filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  // remove duplicates
  emails = [...new Set(emails)];

  if (!emails.length) return;

  return { siret, emails };
};

export const importDecaContent = async (emails: string[], siret: string) => {
  await Promise.all(
    emails.map(async (email) =>
      importPerson({
        email,
        siret,
        source: "DECA",
      })
    )
  );
};

export const getDbVerification = async (
  siret: string,
  email: string
): Promise<IResponse<IPostRoutes["/v1/organisation/validation"]>> => {
  const isCompanyEmail = companyEmailValidator.isCompanyEmail(email);
  const [_user, domain] = email.split("@");
  const siren = getSirenFromSiret(siret);

  // check siren / email
  const personFromEmail = await findPerson({
    email: email,
    sirets: { $regex: `^${siren}` },
  });

  if (personFromEmail !== null) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  // check siren / domain
  if (isCompanyEmail) {
    const organisationFromDomain = await getDbCollection("organisations").findOne({
      email_domains: domain,
      siren,
    });

    if (organisationFromDomain) {
      return {
        is_valid: true,
        on: "domain",
      };
    }

    const personFromDomain = await findPerson({
      email_domain: domain,
      sirets: { $regex: `^${siren}` },
    });

    if (personFromDomain !== null) {
      return {
        is_valid: true,
        on: "domain",
      };
    }
  }

  return { is_valid: false, is_company_email: isCompanyEmail };
};
