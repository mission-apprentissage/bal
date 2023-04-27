import companyEmailValidator from "company-email-validator";
// @ts-ignore
import { accumulateData, oleoduc, writeData } from "oleoduc";
import { SIRET_REGEX } from "shared/constants";
import { IDocument } from "shared/models/document.model";
import { IDocumentContent } from "shared/models/documentContent.model";
import { IResOrganisationValidation } from "shared/routes/v1/organisation.routes";

import * as crypto from "../../utils/cryptoUtils";
import { getFromStorage } from "../../utils/ovhUtils";
import { getJsonFromCsvData } from "../../utils/parserUtils";
import { noop } from "../server/utils/upload.utils";
import {
  createDocumentContent,
  findDocumentContent,
} from "./documentContent.actions";
import { updateDocument } from "./documents.actions";

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

const updateImportProgress = async (
  _id: string,
  currentLine: number,
  totalLines: number,
  currentProgress: number
) => {
  const step_precent = 2; // every 2%
  const currentPercent = (currentLine * 100) / totalLines;
  if (currentPercent - currentProgress < step_precent) {
    // Do not update
    return currentProgress;
  }
  currentProgress = currentPercent;
  await updateDocument(
    { _id },
    {
      $set: {
        import_progress: currentProgress,
      },
    }
  );
  return currentPercent;
};

export const handleDecaFileContent = async (document: IDocument) => {
  const stream = await getFromStorage(document.chemin_fichier);

  let content: ContentLine[] = [];

  await oleoduc(
    stream,
    crypto.isCipherAvailable() ? crypto.decipher(document.hash_secret) : noop(),
    accumulateData(
      (acc: Uint8Array, value: ArrayBuffer) => {
        return Buffer.concat([acc, Buffer.from(value)]);
      },
      { accumulator: Buffer.from(new Uint8Array()) }
    ),
    writeData(async (data: Buffer) => {
      if (document.ext_fichier === "csv") {
        content = getJsonFromCsvData(data.toString(), "|");
      }
    })
  );

  let documentContents: IDocumentContent[] = [];

  await updateDocument(
    { _id: document._id },
    {
      $set: {
        lines_count: content.length,
        import_progress: 0,
      },
    }
  );

  let currentProgress = 0;
  for (const [lineNumber, line] of content.entries()) {
    const contentLine = parseContentLine(line);

    currentProgress = await updateImportProgress(
      document._id,
      lineNumber,
      content.length,
      currentProgress
    );

    if (!contentLine) {
      continue;
    }

    const documentContent = await createDocumentContent({
      content: contentLine,
      document_id: document._id.toString(),
      updated_at: new Date(),
      created_at: new Date(),
    });

    if (!documentContent) continue;

    documentContents = [...documentContents, documentContent];
  }

  await updateDocument(
    { _id: document._id },
    {
      $set: {
        import_progress: 100,
      },
    }
  );

  // Create or update person

  return documentContents;
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
  is_valid = !!(await findDocumentContent({
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
    is_valid = !!(await findDocumentContent({
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
  is_valid = !!(await findDocumentContent({
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
    is_valid = !!(await findDocumentContent({
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
