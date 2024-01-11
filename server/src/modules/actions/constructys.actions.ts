import { DOCUMENT_TYPES } from "shared/constants/documents";
import { SIRET_REGEX } from "shared/constants/regex";

import { updateOrganisationAndPerson } from "./organisations.actions";

interface ContentLine {
  Siret: string;
  Mails?: string;
  "Email du contact"?: string;
}

export interface IConstructysParsedContentLine {
  siret: string;
  emails: string[];
}

export const parseConstructysContentLine = (line: ContentLine): IConstructysParsedContentLine | undefined => {
  if (!line["Email du contact"]) return;
  if (!SIRET_REGEX.test(line.Siret)) return;

  const { Siret: siret } = line;

  // split emails and remove non valid emails
  let emails = line["Email du contact"].split(",").filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  // remove duplicates
  emails = [...new Set(emails)];

  if (!emails.length) return;

  return { siret, emails };
};

export const importConstructysContent = async (content: IConstructysParsedContentLine) => {
  const { siret, emails } = content;
  const uniqueEmails = [...new Set(emails)];

  await Promise.all(uniqueEmails.map((email) => updateOrganisationAndPerson(siret, email, DOCUMENT_TYPES.CONSTRUCTYS)));
};
