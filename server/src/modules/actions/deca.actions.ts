import companyEmailValidator from "company-email-validator";
// @ts-ignore
import { SIRET_REGEX } from "shared/constants/regex";
import { DOCUMENT_TYPES } from "shared/routes/upload.routes";
import { IResOrganisationValidation } from "shared/routes/v1/organisation.routes";

import { findOneDocumentContent } from "./documentContent.actions";

interface ContentLine {
  SIRET: string;
  EMAIL?: string;
}

interface ParsedContentLine {
  siret: string;
  emails: string[];
}

export const parseContentLine = (
  line: ContentLine
): ParsedContentLine | undefined => {
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

export const getDecaVerification = async (
  siret: string,
  email: string
): Promise<IResOrganisationValidation> => {
  let is_valid = false;
  const isBlacklisted = !companyEmailValidator.isCompanyEmail(email);
  const [_user, domain] = email.split("@");
  const siren = siret.substring(0, 9);

  // check siret / email
  is_valid = !!(await findOneDocumentContent({
    type_document: DOCUMENT_TYPES.DECA,
    "content.siret": siret,
    "content.emails": email,
  }));

  if (is_valid) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  // check siret / domain
  if (!isBlacklisted) {
    is_valid = !!(await findOneDocumentContent({
      type_document: DOCUMENT_TYPES.DECA,
      "content.siret": siret,
      "content.emails": { $regex: `.*@${domain}` },
    }));

    if (is_valid) {
      return {
        is_valid: true,
        on: "domain",
      };
    }
  }

  // check siren / email
  is_valid = !!(await findOneDocumentContent({
    type_document: DOCUMENT_TYPES.DECA,
    "content.siret": { $regex: `^${siren}` },
    "content.emails": email,
  }));

  if (is_valid) {
    return {
      is_valid: true,
      on: "email",
    };
  }

  // check siren / domain
  if (!isBlacklisted) {
    is_valid = !!(await findOneDocumentContent({
      type_document: DOCUMENT_TYPES.DECA,
      "content.siret": { $regex: `^${siren}` },
      "content.emails": { $regex: `.*@${domain}` },
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
