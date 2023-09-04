import companyEmailValidator from "company-email-validator";
import { SIRET_REGEX } from "shared/constants/regex";
import { getSirenFromSiret } from "shared/helpers/common";
import { IOrganisation } from "shared/models/organisation.model";

import { getDbCollection } from "../../common/utils/mongodbUtils";
import {
  findOrCreateOrganisation,
  updateOrganisation,
} from "./organisations.actions";

interface ContentLine {
  Siret: string;
  Mails?: string;
}

export interface IConstructysParsedContentLine {
  siret: string;
  emails: string[];
}

export const parseConstructysContentLine = (
  line: ContentLine
): IConstructysParsedContentLine | undefined => {
  if (!line.Mails) return;
  if (!SIRET_REGEX.test(line.Siret)) return;

  const { Siret: siret } = line;

  // split emails and remove non valid emails
  let emails = line.Mails.split(",").filter((e) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
  );
  // remove duplicates
  emails = [...new Set(emails)];

  if (!emails.length) return;

  return { siret, emails };
};

export const importConstructysContent = async (
  content: IConstructysParsedContentLine
) => {
  const { siret, emails } = content;
  const uniqueEmails = [...new Set(emails)];
  const siren = getSirenFromSiret(siret);
  const domains = [...new Set(uniqueEmails.map((e) => e.split("@")[1]))];

  const organisation = await findOrCreateOrganisation(
    { siren },
    {
      siren,
      etablissements: [{ siret }],
      email_domains: domains,
    }
  );

  const updateOrganisationData: Partial<IOrganisation> = {};
  const etablissement = organisation.etablissements?.find(
    (e) => e.siret === siret
  );

  if (!etablissement) {
    const etablissements = organisation.etablissements ?? [];
    etablissements.push({ siret });
    updateOrganisationData.etablissements = etablissements;
  }

  const newDomains = domains.filter(
    (domain) =>
      !organisation.email_domains?.includes(domain) &&
      companyEmailValidator.isCompanyDomain(domain)
  );

  if (newDomains.length) {
    updateOrganisationData.email_domains = organisation.email_domains ?? [];
    updateOrganisationData.email_domains?.push(...newDomains);
  }

  await updateOrganisation(organisation, updateOrganisationData);

  await Promise.all(
    uniqueEmails.map((email) =>
      getDbCollection("persons").updateOne(
        {
          email,
        },
        {
          $addToSet: {
            organisations: organisation._id.toString(),
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
