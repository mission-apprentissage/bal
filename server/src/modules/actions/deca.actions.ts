import { SIRET_REGEX } from "shared/constants/regex";
import { addDays } from "date-fns";
import { getDbCollection } from "../../common/utils/mongodbUtils";
import { getImportPersonBulkOp } from "./persons.actions";
import { getImportOrganisationBulkOp } from "./organisations.actions";

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
  const opsPersons = emails.flatMap((email) =>
    getImportPersonBulkOp({ email, siret, source: "DECA", ttl: addDays(new Date(), 30) })
  );
  const organisationsOps = emails.flatMap((email) =>
    getImportOrganisationBulkOp({ email, siret, source: "DECA", ttl: addDays(new Date(), 30) })
  );

  await Promise.all([
    getDbCollection("persons").bulkWrite(opsPersons),
    getDbCollection("organisations").bulkWrite(organisationsOps),
  ]);
};
