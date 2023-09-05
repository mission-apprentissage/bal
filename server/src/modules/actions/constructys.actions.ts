import { DOCUMENT_TYPES } from "shared/constants/documents";
import { SIRET_REGEX } from "shared/constants/regex";
import { getSirenFromSiret } from "shared/helpers/common";

import { getDbCollection } from "../../common/utils/mongodbUtils";
import { updateOrganisationData } from "./organisations.actions";

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

  const organisation = await updateOrganisationData({
    siren,
    sirets: [siret],
    email_domains: domains,
    source: DOCUMENT_TYPES.CONSTRUCTYS,
  });

  await Promise.all(
    uniqueEmails.map((email) =>
      getDbCollection("persons").updateOne(
        {
          email,
        },
        {
          $addToSet: {
            ...(organisation && { organisations: organisation._id.toString() }),
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
