import companyEmailValidator from "company-email-validator";
// @ts-ignore
import { SIRET_REGEX } from "shared/constants/regex";
import { getSirenFromSiret } from "shared/helpers/common";
import { IResOrganisationValidation } from "shared/routes/v1/organisation.routes";

import { getDbCollection } from "../../common/utils/mongodbUtils";
import {
  createOrganisation,
  findOrganisation,
  updateOrganisation,
} from "./organisations.actions";
import { findPerson } from "./persons.actions";

interface ContentLine {
  SIRET: string;
  EMAIL?: string;
}

export interface DECAParsedContentLine {
  siret: string;
  emails: string[];
}

export const parseContentLine = (
  line: ContentLine
): DECAParsedContentLine | undefined => {
  if (!line.EMAIL) return;
  if (!SIRET_REGEX.test(line.SIRET)) return;

  const { SIRET: siret } = line;

  // remove {}
  const cleanedEmailLine = line.EMAIL?.replace(/[{}]/g, "") ?? "";
  // split emails and remove non valid emails
  let emails = cleanedEmailLine
    .split(",")
    .filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  // remove duplicates
  emails = [...new Set(emails)];

  if (!emails.length) return;

  return { siret, emails };
};

export const importDecaContent = async (emails: string[], siret: string) => {
  const uniqueEmails = [...new Set(emails)];
  const siren = getSirenFromSiret(siret);
  const domains = [...new Set(uniqueEmails.map((e) => e.split("@")[1]))];

  let organisation = await findOrganisation({ siren });

  if (!organisation) {
    const organisationId = await createOrganisation({
      siren,
      etablissements: [{ siret }],
      email_domains: domains,
    });

    organisation = await findOrganisation({ _id: organisationId });
  } else {
    const etablissement = organisation.etablissements?.find(
      (e) => e.siret === siret
    );

    if (!etablissement) {
      organisation.etablissements = organisation.etablissements ?? [];
      organisation.etablissements?.push({ siret });
    }

    const newDomains = domains.filter(
      (domain) =>
        !organisation?.email_domains?.includes(domain) &&
        companyEmailValidator.isCompanyDomain(domain)
    );

    if (newDomains.length) {
      organisation.email_domains = organisation.email_domains ?? [];
      organisation.email_domains?.push(...newDomains);
    }

    await updateOrganisation(organisation, organisation);
  }

  await Promise.all(
    uniqueEmails.map((email) =>
      getDbCollection("persons").updateOne(
        {
          email,
        },
        {
          $addToSet: {
            organisations: organisation?._id ?? [],
            sirets: siret,
          },
          $setOnInsert: {
            email,
          },
        },
        {
          upsert: true,
        }
      )
    )
  );
};

export const getDecaVerification = async (
  siret: string,
  email: string
): Promise<IResOrganisationValidation> => {
  let is_valid = false;
  const isBlacklisted = !companyEmailValidator.isCompanyEmail(email);
  const [_user, domain] = email.split("@");
  const siren = getSirenFromSiret(siret);

  // check siret / email
  is_valid = !!(await findPerson({
    email: email,
    sirets: siret,
  }));

  if (is_valid) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  // check siret / domain
  if (!isBlacklisted) {
    is_valid = !!(await findOrganisation({
      "etablissements.siret": siret,
      email_domains: domain,
    }));

    if (is_valid) {
      return {
        is_valid: true,
        on: "domain",
      };
    }
  }

  // check siren / email
  is_valid = !!(await findPerson({
    email: email,
    sirets: { $regex: `^${siren}` },
  }));

  if (is_valid) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  // check siren / domain
  if (!isBlacklisted) {
    is_valid = !!(await findOrganisation({
      siren: siren,
      email_domains: domain,
    }));

    if (is_valid) {
      return {
        is_valid: true,
        on: "domain",
      };
    }
  }

  return { is_valid };
};
